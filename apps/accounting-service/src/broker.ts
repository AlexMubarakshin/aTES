import {Kafka} from "kafkajs";
import {IBrokerEvent, IBrokerTopic, TOPICS_NAMES, uuid} from "popug-shared";
import {CONFIG} from "./config";

import {processMessage as processUserMessage} from './operations/user'
import {processMessage as processTasksMessage} from './operations/tasks'

const KAFKA_CLIENT_ID = 'accounting-application';

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [`localhost:${CONFIG['broker_port']}`],
});

const producer = kafka.producer();

async function initUsersConsumer() {
  const usersConsumer = kafka.consumer({groupId: KAFKA_CLIENT_ID + '-user-consumer'});

  await usersConsumer.connect();
  await usersConsumer.subscribe({
    topics: [TOPICS_NAMES.USERS_STREAM, TOPICS_NAMES.USERS_ROLE_CHANGED],
    fromBeginning: true
  });

  await usersConsumer.run({
    eachMessage: async ({message,}) => processUserMessage(message)
  })
}

async function initTasksConsumer() {
  const tasksConsumer = kafka.consumer({groupId: KAFKA_CLIENT_ID + '-tasks-consumer'});

  await tasksConsumer.connect();
  await tasksConsumer.subscribe({
    topics: [TOPICS_NAMES.TASKS_COMPLETED, TOPICS_NAMES.TASKS_ADDED, TOPICS_NAMES.TASKS_STREAM],
    fromBeginning: true
  });

  await tasksConsumer.run({
    eachMessage: async ({message}) => processTasksMessage(message)
  });
}

export const initBrokerConnection = async () => {
  await producer.connect();

  await Promise.all([
    initUsersConsumer(),
    initTasksConsumer(),
  ])
}

export async function sendMessages(topic: IBrokerTopic, events: IBrokerEvent[]) {
  const messages = events.map((event) => ({
    value: JSON.stringify({
      ...event,
      id: uuid(),
      producer: KAFKA_CLIENT_ID,
      time: new Date(),
    })
  }));

  return producer.send({topic, messages});
}

export function createEvent(partialEvent: Omit<IBrokerEvent, 'producer' | 'time' | 'id'>): IBrokerEvent {
  const event: IBrokerEvent = {
    producer: KAFKA_CLIENT_ID,
    time: new Date(),
    id: uuid(),
    ...partialEvent
  } as any

  return event
}

