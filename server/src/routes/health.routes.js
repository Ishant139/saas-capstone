const router = require('express').Router();
const mongoose = require('mongoose');
const client = require('prom-client');

client.collectDefaultMetrics();

// Liveness: "is the process alive?"  -> restart the container if this fails.
router.get('/healthz', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Readiness: "can it serve traffic?" -> stop routing traffic if this fails. (Add Redis check later.)
router.get('/readyz', (req, res) => {
  const mongoUp = mongoose.connection.readyState === 1;
  res.status(mongoUp ? 200 : 503).json({ status: mongoUp ? 'ready' : 'not-ready', mongo: mongoUp });
});

router.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = router;
