export const CONFIG = {
  port: process.env.PORT || 3001,
  broker_port: process.env.BROKER_PORT || 9092,
  db_connection_url: process.env.DB_CONNECTION_URL || 'mongodb://admin:password@localhost:27017/?authMechanism=DEFAULT'
} as const
