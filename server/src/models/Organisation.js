const { Schema, model } = require('mongoose');

const organisationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, enum: ['free', 'pro', 'business'], default: 'free' },
    stripeCustomerId: String,
    subscriptionStatus: { type: String, enum: ['none', 'trialing', 'active', 'canceled'], default: 'none' },
    trialEndsAt: Date,
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = model('Organisation', organisationSchema);
