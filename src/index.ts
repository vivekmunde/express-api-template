/**
 * Application entry point. Creates the Express app, configures it, and starts the server.
 */

import { configureApp } from "@/configure-app";
import { PORT } from "@/env";
import express from "express";

const app = configureApp(express());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
