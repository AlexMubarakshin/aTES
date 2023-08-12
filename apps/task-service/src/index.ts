import { createServer } from "./server";
import { log } from "logger";

const port = process.env.PORT || 3002;
const server = createServer();

server.listen(port, () => {
  log(`task service running on ${port}`);
});
