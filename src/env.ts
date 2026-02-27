/**
 * Loads and validates environment variables. All env access in the app
 * should go through exports from this file; do not use process.env elsewhere.
 */

import dotenv from "dotenv";

dotenv.config();

/** Environment variable names that are required and validated at startup. */
type TEnvVariable = "PORT" | "ALLOWED_ORIGINS" | "DATABASE_URL";

/**
 * Whether the value is empty (undefined, null, or empty string).
 * @param value - Value to check
 * @returns True when value is undefined, null, or ""
 */
const isEmpty = (value: string | undefined | null) => {
  return value === undefined || value === null || value === "";
};

/**
 * Builds error message for a missing environment variable.
 * @param variable - Name of the missing variable
 * @returns Error message string
 */
const getErrorMessage = (variable: string) => {
  return `${variable} is missing in environment variables!`;
};

/**
 * Reads a required environment variable; throws if missing or empty.
 * @param variable - Name of the environment variable
 * @returns Non-empty string value
 * @throws Error when the variable is missing or empty
 */
const getEnvVariable = (variable: TEnvVariable) => {
  if (isEmpty(process.env[variable])) {
    throw new Error(getErrorMessage(variable));
  }

  return process.env[variable];
};

/**
 * Whether the server is running in development
 * @example true
 */
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

/**
 * Whether the server is running in production
 * @example true
 */
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * HTTP port
 * @example "5050"
 */
const PORT = getEnvVariable("PORT");

/**
 * Comma-separated list of allowed origins
 * @example "http://localhost:3000,http://localhost:3001"
 */
const ALLOWED_ORIGINS = getEnvVariable("ALLOWED_ORIGINS").split(",");

/**
 * Prisma MongoDB connection URL
 * @example "mongodb://localhost:27017/a6"
 */
const DATABASE_URL = getEnvVariable("DATABASE_URL");

export { ALLOWED_ORIGINS, DATABASE_URL, IS_DEVELOPMENT, IS_PRODUCTION, PORT };
