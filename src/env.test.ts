import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
}));

const REQUIRED_ENV = {
  ALLOWED_ORIGINS: "http://localhost:3000",
  DATABASE_URL: "mongodb://localhost:27017/test",
  PORT: "5050",
} as const;

/**
 * Sets required env vars and optionally NODE_ENV. Call before dynamic import.
 */
function setRequiredEnv(
  overrides: Partial<
    Record<keyof typeof REQUIRED_ENV | "NODE_ENV", string>
  > = {}
): void {
  Object.entries(REQUIRED_ENV).forEach(([key, value]) => {
    process.env[key] = value;
  });
  Object.entries(overrides).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

/**
 * Unsets one required env var by name.
 */
function unsetEnv(key: keyof typeof REQUIRED_ENV): void {
  delete process.env[key];
}

describe("env", () => {
  const envBackup: NodeJS.ProcessEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it("Exports PORT from process.env.PORT when set", async () => {
    setRequiredEnv({ PORT: "8080" });
    const { PORT } = await import("@/env");
    expect(PORT).toBe("8080");
  });

  it("Exports ALLOWED_ORIGINS as array split by comma", async () => {
    setRequiredEnv({ ALLOWED_ORIGINS: "http://a.com,http://b.com" });
    const { ALLOWED_ORIGINS } = await import("@/env");
    expect(ALLOWED_ORIGINS).toEqual(["http://a.com", "http://b.com"]);
  });

  it("Exports single ALLOWED_ORIGIN as single-element array", async () => {
    setRequiredEnv({ ALLOWED_ORIGINS: "http://localhost:3000" });
    const { ALLOWED_ORIGINS } = await import("@/env");
    expect(ALLOWED_ORIGINS).toEqual(["http://localhost:3000"]);
  });

  it("Exports DATABASE_URL from process.env.DATABASE_URL when set", async () => {
    setRequiredEnv({ DATABASE_URL: "mongodb://host:27017/db" });
    const { DATABASE_URL } = await import("@/env");
    expect(DATABASE_URL).toBe("mongodb://host:27017/db");
  });

  it("Exports IS_DEVELOPMENT true when NODE_ENV is development", async () => {
    setRequiredEnv({ NODE_ENV: "development" });
    const { IS_DEVELOPMENT } = await import("@/env");
    expect(IS_DEVELOPMENT).toBe(true);
  });

  it("Exports IS_DEVELOPMENT false when NODE_ENV is not development", async () => {
    setRequiredEnv({ NODE_ENV: "production" });
    const { IS_DEVELOPMENT } = await import("@/env");
    expect(IS_DEVELOPMENT).toBe(false);
  });

  it("Exports IS_PRODUCTION true when NODE_ENV is production", async () => {
    setRequiredEnv({ NODE_ENV: "production" });
    const { IS_PRODUCTION } = await import("@/env");
    expect(IS_PRODUCTION).toBe(true);
  });

  it("Exports IS_PRODUCTION false when NODE_ENV is not production", async () => {
    setRequiredEnv({ NODE_ENV: "development" });
    const { IS_PRODUCTION } = await import("@/env");
    expect(IS_PRODUCTION).toBe(false);
  });

  it("Throws when PORT is missing", async () => {
    setRequiredEnv();
    unsetEnv("PORT");
    await expect(import("@/env")).rejects.toThrow(
      "PORT is missing in environment variables!"
    );
  });

  it("Throws when PORT is empty string", async () => {
    setRequiredEnv({ PORT: "" });
    await expect(import("@/env")).rejects.toThrow(
      "PORT is missing in environment variables!"
    );
  });

  it("Throws when ALLOWED_ORIGINS is missing", async () => {
    setRequiredEnv();
    unsetEnv("ALLOWED_ORIGINS");
    await expect(import("@/env")).rejects.toThrow(
      "ALLOWED_ORIGINS is missing in environment variables!"
    );
  });

  it("Throws when ALLOWED_ORIGINS is empty string", async () => {
    setRequiredEnv({ ALLOWED_ORIGINS: "" });
    await expect(import("@/env")).rejects.toThrow(
      "ALLOWED_ORIGINS is missing in environment variables!"
    );
  });

  it("Throws when DATABASE_URL is missing", async () => {
    setRequiredEnv();
    unsetEnv("DATABASE_URL");
    await expect(import("@/env")).rejects.toThrow(
      "DATABASE_URL is missing in environment variables!"
    );
  });

  it("Throws when DATABASE_URL is empty string", async () => {
    setRequiredEnv({ DATABASE_URL: "" });
    await expect(import("@/env")).rejects.toThrow(
      "DATABASE_URL is missing in environment variables!"
    );
  });
});
