import { TPublicRouteRequestContext } from "@/types/request-context";
import { Request, Response } from "express";
import { routeHandler } from "./route-handler";

/**
 * Wraps an async controller that expects public (unauthenticated) request context.
 * Public routes do not require authentication but may still receive an authenticated request;
 * the handler injects a context with an optional session user so the controller can treat both cases uniformly.
 *
 * Use when registering public routes in route index files. Pass a controller that accepts
 * (req, res, context) and returns a promise of the sent response.
 *
 * @param fn - Async controller that receives req, res, and context (TPublicRouteRequestContext, e.g. optional session user) and returns a promise of the sent response.
 * @returns Express middleware that invokes the controller with public context and passes rejections to next.
 */
const publicRouteHandler = (
  fn: (
    req: Request,
    res: Response,
    context: TPublicRouteRequestContext
  ) => Promise<Response>
) => {
  return routeHandler(async (req: Request, res: Response) => {
    const sessionUser = req.sessionUser;

    return fn(req, res, { sessionUser });
  });
};

export { publicRouteHandler };
