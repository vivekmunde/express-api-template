import dotenv from "dotenv";

dotenv.config();

type TEnvVariable = "PORT" | "ALLOWED_ORIGINS" | "DATABASE_URL";

/**
 * Whether the value is empty
 * @example true
 */
const isEmpty = (value: string | undefined | null) => {
  return value === undefined || value === null || value === "";
};

/**
 * Error message for missing environment variable
 * @example "PORT is missing in environment variables!"
 */
const getErrorMessage = (variable: string) => {
  return `${variable} is missing in environment variables!`;
};

/**
 * Get environment variable
 * @param variable - The environment variable to get
 * @returns The environment variable value
 * @example "5050"
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
