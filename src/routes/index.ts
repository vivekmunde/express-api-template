import { Express } from "express";
import { healthRoutes } from "./health";

const routeRootPrefix = "/";

const routes = (app: Express) => {
  app.use(routeRootPrefix, healthRoutes);
};

export { routes };
