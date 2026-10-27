// Single source of truth for plans, prices and quotas (used for feature gating).
const PLANS = {
  free:     { label: 'Free',     price: 0,  limits: { api_calls: 20,     members: 2 } },
  pro:      { label: 'Pro',      price: 19, limits: { api_calls: 5000,   members: 10 } },
  business: { label: 'Business', price: 79, limits: { api_calls: 100000, members: 100 } },
};

// First day of the current month (UTC) = billing/usage period.
const currentPeriodStart = (d = new Date()) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));

module.exports = { PLANS, currentPeriodStart };
