import { Router } from "express";
import { getHealthController } from "./get/controller";

const healthRoutes = Router();

healthRoutes.get("/health", getHealthController);

export { healthRoutes };
