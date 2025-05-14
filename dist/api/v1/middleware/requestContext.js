import { asyncLocalStorage } from "../utility/logger.js";
/**
 * Middleware to create a request context for logging
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function requestContext(req, res, next) {
  asyncLocalStorage.run({ method: req.method, url: req.originalUrl }, () => {
    next();
  });
}
//# sourceMappingURL=requestContext.js.map
