import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({
  ALLOWED_ORIGINS: ["https://allowed.example.com", "https://other.example.com"],
}));

import { corsOptions } from "@/cors-options";

type TOriginCallback = (err: Error | null, allow?: boolean) => void;

describe("corsOptions", () => {
  it("Sets credentials to true", () => {
    expect(corsOptions.credentials).toBe(true);
  });

  it("Exposes expected HTTP methods", () => {
    const expected = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"];
    expect(corsOptions.methods).toEqual(expected);
    expect(corsOptions.methods).toHaveLength(6);
  });

  it("Calls callback with (null, true) when origin is undefined", () => {
    return new Promise<void>((resolve, reject) => {
      const callback: TOriginCallback = (err, allow) => {
        try {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      const originFn = corsOptions.origin as (
        origin: string | undefined,
        cb: TOriginCallback
      ) => void;
      originFn(undefined, callback);
    });
  });

  it("Calls callback with (null, true) when origin is in ALLOWED_ORIGINS", () => {
    return new Promise<void>((resolve, reject) => {
      const callback: TOriginCallback = (err, allow) => {
        try {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      const originFn = corsOptions.origin as (
        origin: string | undefined,
        cb: TOriginCallback
      ) => void;
      originFn("https://allowed.example.com", callback);
    });
  });

  it("Calls callback with (null, true) for each allowed origin", () => {
    return new Promise<void>((resolve, reject) => {
      let count = 0;
      const callback: TOriginCallback = (err, allow) => {
        try {
          expect(err).toBeNull();
          expect(allow).toBe(true);
          count++;
          if (count === 2) resolve();
        } catch (e) {
          reject(e);
        }
      };
      const originFn = corsOptions.origin as (
        origin: string | undefined,
        cb: TOriginCallback
      ) => void;
      ["https://allowed.example.com", "https://other.example.com"].forEach(
        (origin) => originFn(origin, callback)
      );
    });
  });

  it("Calls callback with NOT_ALLOWED_BY_CORS error when origin is not in ALLOWED_ORIGINS", () => {
    return new Promise<void>((resolve, reject) => {
      const callback: TOriginCallback = (err, allow) => {
        try {
          expect(err).toBeInstanceOf(Error);
          expect(err?.message).toBe("NOT_ALLOWED_BY_CORS");
          expect(allow).toBeUndefined();
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      const originFn = corsOptions.origin as (
        origin: string | undefined,
        cb: TOriginCallback
      ) => void;
      originFn("https://disallowed.example.com", callback);
    });
  });
});
