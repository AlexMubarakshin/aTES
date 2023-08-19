import {Kafka, logLevel} from "kafkajs";
import {CONFIG} from "./config";
import {IBrokerEvent, IBrokerTopic, IBrokerTransportEvent} from 'popug-schemas'
import {uuid} from 'popug-shared'

const KAFKA_CLIENT_ID = 'auth-application';

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [`localhost:${CONFIG['broker_port']}`],
  logLevel: logLevel.DEBUG
});

const producer = kafka.producer();

export const initBrokerConnection = async () => {
  await producer.connect();
};

export async function sendMessages(topic: IBrokerTopic, events: IBrokerEvent[]) {
  const messages = events.map((event) => ({
    value: JSON.stringify({
      ...event,
      producer: KAFKA_CLIENT_ID,
      time: new Date(),
      id: uuid()
    } as IBrokerTransportEvent)
  }));

  return producer.send({topic, messages});
}
