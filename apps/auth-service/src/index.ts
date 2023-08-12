import { createServer } from "./server";
import { log } from "logger";

const port = process.env.PORT || 3001;
const server = createServer();

server.listen(port, () => {
  log(`auth service running on ${port}`);
});
