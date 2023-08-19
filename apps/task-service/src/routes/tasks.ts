import express from 'express';
import {BUSINESS_EVENT, CUD_EVENT, IPopug, POPUG_ROLES, TasksStatuses, TOPICS_NAMES} from "popug-shared";
import {Kafka} from 'kafkajs';
import {CONFIG} from "../config";
import {sendMessages} from "../broker";
import {User} from "../schemas/user";
import {Task} from "../schemas/task";

const KAFKA_CLIENT_ID = 'task-service'

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [`localhost:${CONFIG['broker_port']}`]
});

const producer = kafka.producer();

export const tasksRouter = express.Router()
  .get('/', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).send({error: 'Failed to fetch tasks'});
    }
  })
  .post('/create', async (req, res) => {
    try {
      const {title, description} = req.body;

      const {user} = (req.session as any);
      // console.log({creatorId})
      const userCount = await User.countDocuments({role: POPUG_ROLES.regular});
      const randomUser = await User.findOne().skip(Math.floor(Math.random() * userCount));

      console.log({user, userCount, randomUser})
      if (!randomUser) {
        return res.status(500).send({error: 'No users available for assignment'});
      }

      const assigneeId = randomUser.publicId
      const task = new Task({title, assigneeId, creatorId: (user as IPopug).publicId, description});
      await task.save();

      await producer.send({
        topic: TOPICS_NAMES.TASKS_ADDED,
        messages: [
          {
            key: BUSINESS_EVENT.TASK_ADDED,
            value: JSON.stringify({taskId: task._id, title: task.title, description: task.description, assigneeId})
          }
        ]
      });

      res.status(201).send(task);
    } catch (error) {
      console.error(error);
      res.status(400).send({error: 'Task creation failed'});
    }
  })
  .get('/:taskId', async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) {
        return res.status(404).send({error: 'Task not found'});
      }
      res.send(task);
    } catch (error) {
      res.status(400).send({error: 'Error retrieving task'});
    }
  })
  .put('/:taskId', async (req, res) => {
    try {
      const updates = req.body;
      const task = await Task.findByIdAndUpdate(req.params.taskId, updates, {new: true});
      if (!task) {
        return res.status(404).send({error: 'Task not found'});
      }

      // Produce a message to Kafka after updating the task
      await producer.send({
        topic: TOPICS_NAMES.TASKS_STREAM,
        messages: [
          {
            key: CUD_EVENT.TASK_UPDATED,
            value: JSON.stringify({
              taskId: task._id,
              title: task.title,
              description: task.description,
              status: task.status
            })
          }
        ]
      });

      res.send(task);
    } catch (error) {
      res.status(400).send({error: 'Error updating task'});
    }
  })
  .put('/:taskId/complete', async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.taskId, {status: TasksStatuses.DONE}, {new: true});
      if (!task) {
        return res.status(404).send({error: 'Task not found'});
      }

      // Produce a message to Kafka after completing the task
      await producer.send({
        topic: TOPICS_NAMES.TASKS_COMPLETED,
        messages: [
          {
            key: BUSINESS_EVENT.TASK_COMPLETED,
            value: JSON.stringify({taskId: task._id})
          }
        ]
      });

      res.send(task);
    } catch (error) {
      res.status(400).send({error: 'Error completing task'});
    }
  })
  .delete('/:taskId', async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.taskId);
      if (!task) {
        return res.status(404).send({error: 'Task not found'});
      }

      res.send({message: 'Task deleted successfully'});
    } catch (error) {
      res.status(400).send({error: 'Error deleting task'});
    }
  })
  .put('/:taskId/done', async (req, res) => {
    try {
      const {taskId} = req.params;

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).send({error: 'Task not found'});
      }

      const currentUserId = (req.session as any).user.publicId;
      if (task.assigneeId !== currentUserId) {
        return res.status(403).send({error: 'You are not the assignee of this task'});
      }

      // Check if the task's status is already done
      if (task.status === TasksStatuses.DONE) {
        return res.status(400).send({error: 'Task is already marked as done'});
      }

      task.status = TasksStatuses.DONE;

      await task.save();

      // Produce a message to Kafka after updating the task status
      await sendMessages(TOPICS_NAMES.TASKS_COMPLETED, [{type: BUSINESS_EVENT.TASK_COMPLETED, data: task}]);

      res.status(200).send(task);
    } catch (error) {
      res.status(400).send({error: 'Failed to update task status'});
    }
  })
  .post('/shuffle', async (req, res) => {
    const emitter = (req.session as any).user as IPopug;
    const event = {
      type: BUSINESS_EVENT.TASKS_SHUFFLE_STARTED,
      data: {emitter: emitter.publicId}
    };

    await sendMessages(TOPICS_NAMES.TASKS_SHUFFLE_STARTED, [event]);
  });

