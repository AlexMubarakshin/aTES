import {initBrokerConnection} from "./broker";
import {initDatabaseConnection} from "./database";
import {CONFIG} from "./config";
import {createServer} from "./server";
import {log} from "logger";

initDatabaseConnection();
initBrokerConnection().catch(log)

const server = createServer();

server.listen(CONFIG.port, () => {
  log(`auth service running on ${CONFIG.port}`);
});
