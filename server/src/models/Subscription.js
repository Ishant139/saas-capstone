const { Schema, model } = require('mongoose');

// Mirrors what Stripe will send later (stripeSubscriptionId, priceId, ...).
const subscriptionSchema = new Schema(
  {
    orgId: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true, unique: true },
    stripeSubscriptionId: String,
    priceId: String,
    status: { type: String, enum: ['trialing', 'active', 'canceled'], default: 'active' },
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model('Subscription', subscriptionSchema);
