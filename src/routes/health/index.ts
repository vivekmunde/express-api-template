/**
 * Health check routes.
 */

import { publicRouteHandler } from "@/route-handlers/public-route-handler";
import { Router } from "express";
import { getHealthController } from "./get/controller";

const healthRoutes = Router();

healthRoutes.get("/health", publicRouteHandler(getHealthController));

export { healthRoutes };
