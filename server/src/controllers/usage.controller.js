const UsageRecord = require('../models/UsageRecord');
const Organisation = require('../models/Organisation');
const FeatureFlag = require('../models/FeatureFlag');
const { PLANS, currentPeriodStart } = require('../utils/plans');

// Runs AFTER requireOrgRole + enforceQuota, so we know the org is under its limit.
exports.track = async (req, res) => {
  const record = await UsageRecord.findOneAndUpdate(
    { orgId: req.org._id, metric: req.body.metric, periodStart: currentPeriodStart() },
    { $inc: { quantity: 1 } },
    { upsert: true, new: true }
  );
  res.json({ used: record.quantity, limit: PLANS[req.org.plan].limits[req.body.metric] });
};

exports.summary = async (req, res) => {
  const org = await Organisation.findById(req.query.orgId);
  const records = await UsageRecord.find({ orgId: org._id, metric: req.query.metric }).sort({ periodStart: -1 }).limit(6);
  const total = records.reduce((sum, r) => sum + r.quantity, 0); // reduce
  const current = records.find((r) => +r.periodStart === +currentPeriodStart());
  res.json({
    metric: req.query.metric,
    used: current?.quantity ?? 0,
    limit: PLANS[org.plan].limits[req.query.metric],
    history: records.map((r) => ({ period: r.periodStart, quantity: r.quantity })),
    totalLast6Months: total,
  });
};

// Feature gating: which flags are ON for this org's plan?
exports.flags = async (req, res) => {
  const org = await Organisation.findById(req.params.id);
  const flags = await FeatureFlag.find({ enabledForPlans: org.plan });
  res.json(flags);
};
