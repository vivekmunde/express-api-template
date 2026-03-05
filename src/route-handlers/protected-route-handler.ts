import { STATUS_CODES } from "@/constants/status-codes";
import { TProtectedRouteRequestContext } from "@/types/request-context";
import { Request, Response } from "express";
import { routeHandler } from "./route-handler";

/**
 * Wraps an async controller that expects protected (authenticated) request context.
 * Protected routes require a valid session; the handler checks req.sessionUser and returns
 * 401 if missing, otherwise injects context with the session user for the controller.
 *
 * Use when registering protected routes in route index files. Pass a controller that accepts
 * (req, res, context) and returns a promise of the sent response.
 *
 * @param fn - Async controller that receives req, res, and context (TProtectedRouteRequestContext with sessionUser) and returns a promise of the sent response.
 * @returns Express middleware that enforces authentication, invokes the controller with protected context, and passes rejections to next.
 */
const protectedRouteHandler = (
  fn: (
    req: Request,
    res: Response,
    context: TProtectedRouteRequestContext
  ) => Promise<Response>
) => {
  return routeHandler(async (req: Request, res: Response) => {
    const sessionUser = req.sessionUser;

    if (!sessionUser?.id) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({});
    }

    return fn(req, res, { sessionUser });
  });
};

export { protectedRouteHandler };
