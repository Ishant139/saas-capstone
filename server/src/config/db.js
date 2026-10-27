const mongoose = require('mongoose');
const { mongoUri } = require('./env');
const logger = require('../utils/logger');

// async/await + Promise: connect() returns a Promise.
async function connectDB() {
  await mongoose.connect(mongoUri);
  logger.info('MongoDB connected');
}

module.exports = connectDB;
