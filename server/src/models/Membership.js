const { Schema, model } = require('mongoose');

const membershipSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: 'Organisation', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
  invitedAt: { type: Date, default: Date.now },
  acceptedAt: Date,
});
membershipSchema.index({ orgId: 1, userId: 1 }, { unique: true });

module.exports = model('Membership', membershipSchema);
