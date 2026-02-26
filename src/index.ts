import { corsOptions } from "@/cors-options";
import { PORT } from "@/env";
import { initializeI18n } from "@/initialize-i18n";
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
