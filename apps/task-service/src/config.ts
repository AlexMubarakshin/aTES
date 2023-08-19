export const CONFIG = {
  port: process.env.PORT || 3002,
  broker_port: process.env.BROKER_PORT || 9092,
  db_connection_url: process.env.DB_CONNECTION_URL || 'mongodb://admin:password@localhost:27018/?authMechanism=DEFAULT',
  express_session_key: 'THE_MOST_SECRET_KEY',
  sso_service_login_endpoint: process.env.SSO_SERVICE_LOGIN_ENDPOINT || 'http://localhost:3001/sso/login?redirectUrl=http://localhost:3002'
} as const
