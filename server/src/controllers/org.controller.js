const Organisation = require('../models/Organisation');
const Membership = require('../models/Membership');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const audit = require('../utils/audit');
const { PLANS } = require('../utils/plans');

const slugify = (s) => `${s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Math.random().toString(36).slice(2, 6)}`;

// CREATE
exports.create = async (req, res) => {
  const org = await Organisation.create({ name: req.body.name, slug: slugify(req.body.name), owner: req.user.id });
  await Membership.create({ orgId: org._id, userId: req.user.id, role: 'owner', acceptedAt: new Date() });
  audit(org._id, req.user.id, 'org.created');
  res.status(201).json(org);
};

// READ (list) - Promise.all runs the per-org lookups in parallel.
exports.list = async (req, res) => {
  const memberships = await Membership.find({ userId: req.user.id, acceptedAt: { $ne: null } });
  const orgs = await Promise.all(
    memberships.map(async (m) => {
      const [org, memberCount] = await Promise.all([
        Organisation.findById(m.orgId).lean(),
        Membership.countDocuments({ orgId: m.orgId }),
      ]);
      return { ...org, role: m.role, memberCount }; // spread operator
    })
  );
  res.json(orgs);
};

// READ (one)
exports.getOne = async (req, res) => {
  const org = await Organisation.findById(req.params.id);
  res.json({ ...org.toObject(), role: req.membership.role });
};

// UPDATE
exports.update = async (req, res) => {
  const org = await Organisation.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  audit(org._id, req.user.id, 'org.renamed', { name: org.name });
  res.json(org);
};

// DELETE
exports.remove = async (req, res) => {
  await Promise.all([
    Organisation.findByIdAndDelete(req.params.id),
    Membership.deleteMany({ orgId: req.params.id }),
  ]);
  audit(req.params.id, req.user.id, 'org.deleted');
  res.status(204).end();
};

// Members
exports.listMembers = async (req, res) => {
  const members = await Membership.find({ orgId: req.params.id }).populate('userId', 'name email').lean();
  res.json(members.map(({ userId, role, acceptedAt }) => ({ user: userId, role, acceptedAt })));
};

exports.invite = async (req, res) => {
  const org = await Organisation.findById(req.params.id);
  const count = await Membership.countDocuments({ orgId: org._id });
  if (count >= PLANS[org.plan].limits.members) {
    throw new ApiError(403, `The ${org.plan} plan allows ${PLANS[org.plan].limits.members} members. Upgrade to invite more.`);
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(404, 'No account with that email yet');
  // Simplified: the invite is accepted instantly. Real flow = emailed token + accept endpoint.
  const m = await Membership.create({ orgId: org._id, userId: user._id, role: req.body.role, acceptedAt: new Date() });
  audit(org._id, req.user.id, 'member.invited', { email: user.email });
  res.status(201).json(m);
};

exports.changeRole = async (req, res) => {
  const m = await Membership.findOne({ orgId: req.params.id, userId: req.params.userId });
  if (!m) throw new ApiError(404, 'Member not found');
  if (m.role === 'owner') throw new ApiError(400, 'The owner role cannot be changed');
  m.role = req.body.role;
  await m.save();
  audit(req.params.id, req.user.id, 'member.role_changed', { userId: req.params.userId, role: m.role });
  res.json(m);
};

exports.removeMember = async (req, res) => {
  const m = await Membership.findOne({ orgId: req.params.id, userId: req.params.userId });
  if (!m) throw new ApiError(404, 'Member not found');
  if (m.role === 'owner') throw new ApiError(400, 'The owner cannot be removed');
  await m.deleteOne();
  res.status(204).end();
};
