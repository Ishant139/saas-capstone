const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const crypto = require('crypto');
const pinoHttp = require('pino-http');
const { clientOrigin } = require('./config/env');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
// CORS: only our frontend origin may call the API from a browser.
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());

// Request id on every request + structured request logs
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});
app.use(pinoHttp({ logger, genReqId: (req) => req.id }));

app.use('/', require('./routes/health.routes'));
app.use('/api', require('./routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
