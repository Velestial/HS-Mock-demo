'use strict';

module.exports = function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  const status = err.status || err.response?.status || 500;
  res.status(status).json({
    error: true,
    code: err.code || 'INTERNAL_ERROR',
    message: err.message || 'Unexpected error',
  });
};
