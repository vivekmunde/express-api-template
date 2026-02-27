import { ALLOWED_ORIGINS } from "@/env";
import cors from "cors";

/**
 * CORS configuration: allows only origins in ALLOWED_ORIGINS, supports
 * credentials, and permits common HTTP methods.
 */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("NOT_ALLOWED_BY_CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

export { corsOptions };
