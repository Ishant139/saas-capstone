const { Schema, model } = require('mongoose');

module.exports = model(
  'FeatureFlag',
  new Schema({
    key: { type: String, required: true, unique: true },
    description: String,
    enabledForPlans: [{ type: String, enum: ['free', 'pro', 'business'] }],
    rolloutPct: { type: Number, default: 100, min: 0, max: 100 },
  })
);
