const ApiError = require('../utils/ApiError');

// validate(schema) -> middleware. Checks body/params/query with Zod.
module.exports = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ path: i.path.slice(1).join('.'), message: i.message }));
    return next(new ApiError(400, 'Validation failed', details));
  }
  if (result.data.body) req.body = result.data.body; // keeps defaults / strips unknown keys
  if (result.data.query) req.query = result.data.query;
  next();
};
