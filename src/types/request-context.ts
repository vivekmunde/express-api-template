import { User } from "@prisma/client";

/**
 * Shape of the request context for public routes.
 * Public routes do not require authentication and may receive an authenticated request.
 */
export type TPublicRouteRequestContext = {
  /** Optional session user for authenticated public routes. */
  sessionUser?: User;
};

/**
 * Shape of the request context for protected routes.
 * Protected routes require authentication and receive a session user.
 */
export type TProtectedRouteRequestContext = {
  /** Session user for authenticated protected routes. */
  sessionUser: User;
};
