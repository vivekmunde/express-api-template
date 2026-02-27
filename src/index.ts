/**
 * Application entry point. Initializes the Express app and starts the server.
 */

import { corsOptions } from "@/cors-options";
import { PORT } from "@/env";
import { initializeI18n } from "@/initialize-i18n";
import { errorHandlerMiddleware } from "@/middlewares/error-handler-middleware";
import { routes } from "@/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import i18nextHttpMiddleware from "i18next-http-middleware";

const app = express();

// CORS: allow only configured origins; support credentials
app.use(cors(corsOptions));
// Parse Cookie header into req.cookies
app.use(cookieParser());
// Parse JSON request bodies
app.use(express.json());
// i18n: detect language and attach t() to req
app.use(i18nextHttpMiddleware.handle(initializeI18n()));

routes(app);

// Error handler middleware must run after all routes so unhandled errors are caught
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
