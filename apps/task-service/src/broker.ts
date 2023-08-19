import {Kafka} from "kafkajs";
import {CONFIG} from "./config";
import {IBrokerEvent, IBrokerTopic, TOPICS_NAMES} from 'popug-schemas'
import {uuid} from 'popug-shared'

import {processMessage as processUserMessage} from './operations/user'

const KAFKA_CLIENT_ID = 'task-application';

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [`localhost:${CONFIG['broker_port']}`],
  // logLevel: logLevel.DEBUG
});

const producer = kafka.producer();

export const initBrokerConnection = async () => {
  await producer.connect();

  const usersConsumer = kafka.consumer({groupId: KAFKA_CLIENT_ID + '-user-consumer'});

  await usersConsumer.connect();
  await usersConsumer.subscribe({
    topics: [TOPICS_NAMES.USERS_STREAM, TOPICS_NAMES.USERS_ROLE_CHANGED],
    fromBeginning: true
  });

  return usersConsumer.run({
    eachMessage: async ({message,}) => processUserMessage(message)
  });
};

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

