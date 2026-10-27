const router = require('express').Router();
const ctrl = require('../controllers/org.controller');
const usage = require('../controllers/usage.controller');
const validate = require('../middleware/validate');
const { requireAuth, requireOrgRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const s = require('../validators/schemas');

router.use(requireAuth); // every org route needs login

router.route('/')
  .get(asyncHandler(ctrl.list))
  .post(validate(s.createOrg), asyncHandler(ctrl.create));

router.route('/:id')
  .get(validate(s.orgId), requireOrgRole(), asyncHandler(ctrl.getOne))
  .patch(validate(s.updateOrg), requireOrgRole(['owner', 'admin']), asyncHandler(ctrl.update))
  .delete(validate(s.orgId), requireOrgRole(['owner']), asyncHandler(ctrl.remove));

router.get('/:id/members', validate(s.orgId), requireOrgRole(), asyncHandler(ctrl.listMembers));
router.post('/:id/invites', validate(s.invite), requireOrgRole(['owner', 'admin']), asyncHandler(ctrl.invite));
router.patch('/:id/members/:userId/role', validate(s.changeRole), requireOrgRole(['owner', 'admin']), asyncHandler(ctrl.changeRole));
router.delete('/:id/members/:userId', validate(s.removeMember), requireOrgRole(['owner', 'admin']), asyncHandler(ctrl.removeMember));
router.get('/:id/flags', validate(s.orgId), requireOrgRole(), asyncHandler(usage.flags));

module.exports = router;
