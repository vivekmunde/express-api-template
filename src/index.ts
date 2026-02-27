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

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(i18nextHttpMiddleware.handle(initializeI18n()));

routes(app);

// Error handler middleware must be after all other middleware and routes
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
