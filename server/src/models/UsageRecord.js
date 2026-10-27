const { Schema, model } = require('mongoose');

const usageSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
  metric: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  periodStart: { type: Date, required: true },
});
usageSchema.index({ orgId: 1, metric: 1, periodStart: 1 }, { unique: true });

module.exports = model('UsageRecord', usageSchema);
