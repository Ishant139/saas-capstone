const router = require('express').Router();
const ctrl = require('../controllers/billing.controller');
const validate = require('../middleware/validate');
const { requireAuth, requireOrgRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const s = require('../validators/schemas');

router.get('/plans', ctrl.plans);
router.post(
  '/checkout-session',
  requireAuth,
  validate(s.checkout),
  requireOrgRole(['owner', 'admin'], (req) => req.body.orgId),
  asyncHandler(ctrl.checkout)
);

module.exports = router;
