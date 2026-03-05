import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      /** Session user set by auth middleware when the request is authenticated. */
      sessionUser?: User;
    }
  }
}

export {};
