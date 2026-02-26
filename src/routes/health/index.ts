import { Router } from "express";
import { GET } from "./get/controller";

const healthRoutes = Router();

healthRoutes.get("/health", GET);

export { healthRoutes };
