const router = require('express').Router();
const ctrl = require('../controllers/usage.controller');
const validate = require('../middleware/validate');
const enforceQuota = require('../middleware/quota');
const { requireAuth, requireOrgRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const s = require('../validators/schemas');

router.use(requireAuth);

// Middleware chain: auth -> validate -> membership -> quota -> controller
router.post('/track', validate(s.track), requireOrgRole([], (req) => req.body.orgId), enforceQuota('api_calls'), asyncHandler(ctrl.track));
router.get('/', validate(s.usageQuery), requireOrgRole([], (req) => req.query.orgId), asyncHandler(ctrl.summary));

module.exports = router;
