function notFoundHandler(req, res) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: error.message } });
  }

  if (error.code === 11000) {
    return res.status(409).json({ error: { code: "DUPLICATE_RESOURCE", message: "Resource already exists" } });
  }

  console.error(error);
  return res.status(error.statusCode || 500).json({
    error: {
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.statusCode ? error.message : "An unexpected error occurred",
    },
  });
}

module.exports = { notFoundHandler, errorHandler };
