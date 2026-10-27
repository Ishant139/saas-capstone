const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');
const logger = require('./utils/logger');

(async () => {
  await connectDB();
  const server = app.listen(port, () => logger.info(`API listening on :${port}`));

  // Graceful shutdown (Docker sends SIGTERM on deploy) -> finish requests, then exit.
  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  ['SIGTERM', 'SIGINT'].forEach((sig) => process.on(sig, () => shutdown(sig)));
})().catch((err) => {
  logger.error({ err }, 'failed to start');
  process.exit(1);
});
