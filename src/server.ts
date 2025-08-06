import { Server } from "http";
import { app } from "./app";
import config from "./config";

let server: Server;

async function run() {
  const appInstance = await app();
  server = await appInstance.listen(Number(config.port as string));
}

// Graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
    });
  }
  process.exit(1);
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) server.close();
});

// Run app
run()
  .then((): void => {
    console.log(`Server is running on port ${config.port}`);
  })
  .catch((err: any): void => {
    console.error(err);
    process.exit(1);
  });
