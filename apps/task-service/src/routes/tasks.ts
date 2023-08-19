import express from 'express';
import {IPopug, POPUG_ROLES, TasksStatuses, BUSINESS_EVENT, CUD_EVENT, TOPICS_NAMES, validateEvent} from "popug-shared";
import {sendMessages, createEvent} from "../broker";
import {User} from "../schemas/user";
import {Task} from "../schemas/task";

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

      const userCount = await User.countDocuments({role: POPUG_ROLES.regular});
      const randomUser = await User.findOne().skip(Math.floor(Math.random() * userCount));

      console.log({user, userCount, randomUser})
      if (!randomUser) {
        return res.status(500).send({error: 'No users available for assignment'});
      }

      const assigneeId = randomUser.publicId
      const task = new Task({title, assigneeId, creatorId: (user as IPopug).publicId, description});
      await task.save();

      const event = createEvent({
        type: BUSINESS_EVENT.TASK_ADDED,
        version: 1,
        data: {taskId: task._id, title: task.title, description: task.description, assigneeId}
      });

      await sendMessages(TOPICS_NAMES.TASKS_ADDED, [event]);

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

      const event = createEvent({
        type: CUD_EVENT.TASK_UPDATED,
        version: 1,
        data: {
          taskId: task._id,
          title: task.title,
          description: task.description,
          status: task.status
        }
      });

      await sendMessages(TOPICS_NAMES.TASKS_STREAM, [event]);

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

      const event = createEvent({
        type: BUSINESS_EVENT.TASK_COMPLETED,
        version: 1,
        data: {
          taskId: task._id
        }
      });

      await sendMessages(TOPICS_NAMES.TASKS_COMPLETED, [event]);

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

      const event = createEvent({
        type: BUSINESS_EVENT.TASK_COMPLETED,
        data: task,
        version: 1
      })

      const eventValidationResult = validateEvent(event);
      if (!eventValidationResult.isValid) {
        console.error(eventValidationResult.error);
        throw new Error('Event schema validation error')
      }

      await sendMessages(TOPICS_NAMES.TASKS_COMPLETED, [event]);

      res.status(200).send(task);
    } catch (error) {
      res.status(400).send({error: 'Failed to update task status'});
    }
  })
  .post('/shuffle', async (req, res) => {
    const emitter = (req.session as any).user as IPopug;
    const partialEvent = {
      type: BUSINESS_EVENT.TASKS_SHUFFLE_STARTED,
      data: {emitter: emitter.publicId},
      version: 1
    };

    const event = createEvent(partialEvent)

    const eventValidationResult = validateEvent(event);
    if (!eventValidationResult.isValid) {
      console.error(eventValidationResult.error);
      throw new Error('Event schema validation error')
    }

    await sendMessages(TOPICS_NAMES.TASKS_SHUFFLE_STARTED, [event]);
  });

