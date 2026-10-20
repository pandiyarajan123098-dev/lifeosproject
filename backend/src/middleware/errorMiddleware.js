/**
 * Centralized error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

/**
 * 404 Route Not Found middleware
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
