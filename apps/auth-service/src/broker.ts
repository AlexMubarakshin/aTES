// Kafka setup
import {Kafka} from "kafkajs";
import {CONFIG} from "./config";

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [`localhost:${CONFIG['broker_port']}`]
});

const producer = kafka.producer();
const consumer = kafka.consumer({groupId: 'user-group'});

export const initBrokerConnection = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({topic: 'user-topic', fromBeginning: true});

  consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      console.log({
        value: message.value?.toString(),
      });
    },
  });
};


export async function sendMessages(topic: string, events: Array<Record<string, any> | string>) {
  const messages = events.map((event) => ({value: JSON.stringify(event)}));

  return producer.send({topic, messages});
}
