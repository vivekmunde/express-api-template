import { describe, expect, it } from "vitest";
import { STATUS_CODES } from "@/constants/status-codes";

describe("STATUS_CODES", () => {
  it("Exposes expected HTTP status code values", () => {
    expect(STATUS_CODES.OK).toBe(200);
    expect(STATUS_CODES.BAD_REQUEST).toBe(400);
    expect(STATUS_CODES.UNAUTHORIZED).toBe(401);
    expect(STATUS_CODES.FORBIDDEN).toBe(403);
    expect(STATUS_CODES.NOT_FOUND).toBe(404);
    expect(STATUS_CODES.INTERNAL_SERVER_ERROR).toBe(500);
  });

  it("Exposes all expected keys", () => {
    const keys = Object.keys(STATUS_CODES);
    expect(keys).toContain("OK");
    expect(keys).toContain("BAD_REQUEST");
    expect(keys).toContain("UNAUTHORIZED");
    expect(keys).toContain("FORBIDDEN");
    expect(keys).toContain("NOT_FOUND");
    expect(keys).toContain("INTERNAL_SERVER_ERROR");
    expect(keys).toHaveLength(6);
  });
});
