const Organisation = require('../models/Organisation');
const Subscription = require('../models/Subscription');
const { PLANS } = require('../utils/plans');
const audit = require('../utils/audit');

exports.plans = (req, res) => {
  res.json(Object.entries(PLANS).map(([key, p]) => ({ key, ...p })));
};

// MOCK checkout: changes the plan directly.
// Later: create a Stripe Checkout Session here and let the webhook flip the plan.
exports.checkout = async (req, res) => {
  const { orgId, plan } = req.body;
  const org = await Organisation.findById(orgId);
  const firstPaid = plan !== 'free' && org.plan === 'free' && !org.trialEndsAt;

  org.plan = plan;
  if (plan === 'free') org.subscriptionStatus = 'none';
  else if (firstPaid) {
    org.subscriptionStatus = 'trialing';
    org.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  } else org.subscriptionStatus = 'active';
  await org.save();

  await Subscription.findOneAndUpdate(
    { orgId },
    { priceId: `price_${plan}`, status: org.subscriptionStatus === 'none' ? 'canceled' : org.subscriptionStatus, currentPeriodEnd: new Date(Date.now() + 30 * 864e5) },
    { upsert: true, new: true }
  );
  audit(orgId, req.user.id, 'billing.plan_changed', { plan });
  res.json(org);
};
