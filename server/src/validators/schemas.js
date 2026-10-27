const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

exports.register = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

exports.login = z.object({
  body: z.object({ email: z.string().email(), password: z.string().min(1) }),
});

exports.createOrg = z.object({ body: z.object({ name: z.string().min(2).max(60) }) });
exports.updateOrg = z.object({ params: z.object({ id: objectId }), body: z.object({ name: z.string().min(2).max(60) }) });
exports.orgId = z.object({ params: z.object({ id: objectId }) });

exports.invite = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ email: z.string().email(), role: z.enum(['admin', 'member']).default('member') }),
});

exports.changeRole = z.object({
  params: z.object({ id: objectId, userId: objectId }),
  body: z.object({ role: z.enum(['admin', 'member']) }),
});

exports.removeMember = z.object({ params: z.object({ id: objectId, userId: objectId }) });

exports.checkout = z.object({ body: z.object({ orgId: objectId, plan: z.enum(['free', 'pro', 'business']) }) });
exports.track = z.object({ body: z.object({ orgId: objectId, metric: z.enum(['api_calls']) }) });
exports.usageQuery = z.object({ query: z.object({ orgId: objectId, metric: z.string().default('api_calls') }) });
