const AuditLog = require('../models/AuditLog');
const logger = require('./logger');

// Fire-and-forget: an audit failure should never break the request.
module.exports = (orgId, actorId, action, meta = {}) =>
  AuditLog.create({ orgId, actorId, action, meta }).catch((err) => logger.error({ err }, 'audit failed'));
