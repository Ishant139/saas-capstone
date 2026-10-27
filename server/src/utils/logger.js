const pino = require('pino');
// Structured JSON logs (easy to ship to Logtail/CloudWatch later).
module.exports = pino({ level: process.env.NODE_ENV === 'test' ? 'silent' : 'info' });
