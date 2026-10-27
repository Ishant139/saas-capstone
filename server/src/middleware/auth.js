const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const Membership = require('../models/Membership');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// 1) Is the caller logged in?
exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Authentication required'));
  try {
    req.user = jwt.verify(token, jwtSecret); // { id }
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

// 2) Does the caller belong to the org with one of the allowed roles?
//    getOrgId tells the middleware where the org id lives (params, body or query).
exports.requireOrgRole = (roles = [], getOrgId = (req) => req.params.id) =>
  asyncHandler(async (req, res, next) => {
    const membership = await Membership.findOne({ orgId: getOrgId(req), userId: req.user.id, acceptedAt: { $ne: null } });
    if (!membership) throw new ApiError(404, 'Organisation not found');
    if (roles.length && !roles.includes(membership.role)) throw new ApiError(403, 'Insufficient role');
    req.membership = membership;
    next();
  });
