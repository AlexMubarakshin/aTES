import {KafkaMessage} from "kafkajs";

export type IProcessMessage = (msg: KafkaMessage) => void
