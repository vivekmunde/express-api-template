import { NextFunction, Request, Response } from "express";

/**
 * Wraps an async controller that receives req and res and returns a promise of the sent response.
 * Express does not pass async rejections to error middleware; this wrapper forwards rejections to
 * next so a single error handler can respond consistently.
 *
 * Use when registering routes in route index files. Pass a controller that accepts (req, res)
 * and returns a promise of the sent response. For routes that need request context (e.g. public
 * or protected), use publicRouteHandler or a protectedRouteHandler instead; they delegate here.
 *
 * @param fn - Async controller that receives req, res and returns a promise of the sent response.
 * @returns Express middleware that invokes the controller and passes rejections to next.
 */
const routeHandler =
  (fn: (req: Request, res: Response) => Promise<Response>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res).catch(next);
  };

export { routeHandler };
