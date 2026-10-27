const { Schema, model } = require('mongoose');

module.exports = model(
  'AuditLog',
  new Schema({
    orgId: { type: Schema.Types.ObjectId, ref: 'Organisation' },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    meta: Schema.Types.Mixed,
    at: { type: Date, default: Date.now },
  })
);
