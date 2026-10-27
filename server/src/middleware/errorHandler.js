const logger = require('../utils/logger');

exports.notFound = (req, res) => res.status(404).json({ error: 'Route not found' });

// Central error handler: the LAST middleware in the chain (4 args).
// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ error: 'Already exists' });
  const status = err.status || 500;
  if (status >= 500) logger.error({ err, reqId: req.id }, 'unhandled error');
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message, details: err.details });
};
