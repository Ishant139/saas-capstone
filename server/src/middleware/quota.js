const Organisation = require('../models/Organisation');
const UsageRecord = require('../models/UsageRecord');
const { PLANS, currentPeriodStart } = require('../utils/plans');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// Rejects over-limit requests with 429 (per-plan quota enforcement).
module.exports = (metric) =>
  asyncHandler(async (req, res, next) => {
    const org = await Organisation.findById(req.membership.orgId);
    const limit = PLANS[org.plan].limits[metric];
    const record = await UsageRecord.findOne({ orgId: org._id, metric, periodStart: currentPeriodStart() });
    const used = record?.quantity ?? 0;
    if (used >= limit) throw new ApiError(429, `Quota reached for ${metric} on the ${org.plan} plan`, { used, limit });
    req.org = org;
    next();
  });
