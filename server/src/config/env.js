require('dotenv').config();

// Never hard-code secrets: everything comes from environment variables.
module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/saas',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
