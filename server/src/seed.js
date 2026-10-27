const mongoose = require('mongoose');
const connectDB = require('./config/db');
const FeatureFlag = require('./models/FeatureFlag');

const flags = [
  { key: 'basic-dashboard', description: 'Usage dashboard', enabledForPlans: ['free', 'pro', 'business'] },
  { key: 'team-roles', description: 'Admin / member roles', enabledForPlans: ['pro', 'business'] },
  { key: 'audit-log', description: 'Audit log access', enabledForPlans: ['business'] },
];

(async () => {
  await connectDB();
  await Promise.all(flags.map((f) => FeatureFlag.findOneAndUpdate({ key: f.key }, f, { upsert: true })));
  console.log('Seeded feature flags');
  await mongoose.disconnect();
})();
