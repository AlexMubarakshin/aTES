import {initBrokerConnection} from "./broker";
import {CONFIG} from "./config";
import {initDatabaseConnection} from "./database";
import {createServer} from "./server";
import {log} from "logger";


async function main() {
  await initDatabaseConnection()

  await initBrokerConnection()

  const server = createServer();

  server.listen(CONFIG.port, () => {
    log(`task service running on ${CONFIG.port}`);
  });
}

main()
