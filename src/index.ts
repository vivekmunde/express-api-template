import { ALLOWED_ORIGINS, PORT } from "@/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

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

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ name: "a6-server", status: "ok" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
