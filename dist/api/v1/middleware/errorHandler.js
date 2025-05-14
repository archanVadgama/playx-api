export const errorMiddleware = (err, _req, res, _next) => {
  // your error logic
  res.status(500).json({
    status: false,
    message: (err === null || err === void 0 ? void 0 : err.message) || "Internal Server Error",
    data: null,
  });
};
//# sourceMappingURL=errorHandler.js.map
