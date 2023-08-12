import mongoose from "mongoose";
import {CONFIG} from "./config";
import {log} from "logger";

export async function initDatabaseConnection() {
  await mongoose.connect(CONFIG['db_connection_url']);

  mongoose.connection.on('connected', () => {
    log(`Mongoose default connection open to ${CONFIG['db_connection_url']}`);
  });

  mongoose.connection.on('error', (err) => {
    log(`Mongoose default connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    log('Mongoose default connection disconnected');
  });
}
