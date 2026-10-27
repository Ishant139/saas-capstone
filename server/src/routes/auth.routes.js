const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const s = require('../validators/schemas');

router.post('/register', validate(s.register), asyncHandler(ctrl.register));
router.post('/login', validate(s.login), asyncHandler(ctrl.login));
router.get('/me', requireAuth, asyncHandler(ctrl.me));

module.exports = router;
