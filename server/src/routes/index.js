const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/orgs', require('./org.routes'));
router.use('/billing', require('./billing.routes'));
router.use('/usage', require('./usage.routes'));

module.exports = router;
