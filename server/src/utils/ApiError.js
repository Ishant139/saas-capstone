// Custom error class so controllers can do: throw new ApiError(404, 'Not found')
class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
module.exports = ApiError;
