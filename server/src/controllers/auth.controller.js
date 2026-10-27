const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config/env');
const ApiError = require('../utils/ApiError');

const sign = (user) => jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
const publicUser = ({ _id, name, email }) => ({ id: _id, name, email });

exports.register = async (req, res) => {
  const { name, email, password } = req.body; // destructuring
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  res.status(201).json({ token: sign(user), user: publicUser(user) });
};

exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(req.body.password, user.passwordHash));
  if (!ok) throw new ApiError(401, 'Wrong email or password');
  res.json({ token: sign(user), user: publicUser(user) });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(401, 'User no longer exists');
  res.json({ user: publicUser(user) });
};
