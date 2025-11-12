module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const details = err.details || undefined;

  res.status(status).json({
    error: message,
    ...(details ? { details } : {}),
  });
};

