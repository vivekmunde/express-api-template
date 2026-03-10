/**
 * Main configuration file for the Express application.
 */

import { corsOptions } from "@/cors-options";
import { initializeI18n } from "@/initialize-i18n";
import { corsErrorHandlerMiddleware } from "@/middlewares/cors-error-handler-middleware";
import { errorHandlerMiddleware } from "@/middlewares/error-handler-middleware";
import { routes } from "@/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { handle as i18nextHttpMiddlewareHandle } from "i18next-http-middleware";

/**
 * Configures the given Express application with middlewares and routes.
 * @param app - The Express app instance to configure.
 * @returns The same Express app instance after configuration.
 */
const configureApp = (app: Express): Express => {
  // CORS: allow only configured origins; support credentials
  app.use(cors(corsOptions));
  // Parse Cookie header into req.cookies
  app.use(cookieParser());
  // Parse JSON request bodies
  app.use(express.json());
  // i18n: detect language and attach t() to req
  app.use(i18nextHttpMiddlewareHandle(initializeI18n()));
  // CORS error handler middleware
  app.use(corsErrorHandlerMiddleware);

  routes(app);

  // Error handler middleware must run after all routes so unhandled errors are caught
  app.use(errorHandlerMiddleware);

  return app;
};

export { configureApp };
