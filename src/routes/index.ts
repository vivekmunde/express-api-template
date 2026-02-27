import { Express } from "express";
import { healthRoutes } from "./health";

/** Path prefix for all routes (root). */
const routeRootPrefix = "/";

/**
 * Registers & mounts all route routers on the given Express app.
 * @param app - Express application instance
 */
const routes = (app: Express): void => {
  app.use(routeRootPrefix, healthRoutes);
};

export { routes };
