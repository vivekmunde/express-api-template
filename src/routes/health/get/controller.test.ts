import { STATUS_CODES } from "@/constants/status-codes";
import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { getHealthController } from "./controller";

function createMockRequest(tReturnValue: string = "Healthy"): Request {
  return {
    i18n: {
      t: vi.fn((key: string, opts?: { ns?: string }) => {
        if (key === "healthy" && opts?.ns === "word") return tReturnValue;
        return key;
      }),
    },
  } as unknown as Request;
}

function createMockResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

describe("getHealthController", () => {
  it("Returns 200 and response body with data.status from i18n", async () => {
    const req = createMockRequest("Healthy");
    const res = createMockResponse();
    await getHealthController(req, res);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: { status: "Healthy" },
    });
  });

  it("Calls i18n.t with key healthy and ns word", async () => {
    const req = createMockRequest("OK");
    const res = createMockResponse();
    await getHealthController(req, res);
    expect(req.i18n.t).toHaveBeenCalledWith("healthy", { ns: "word" });
    expect(res.json).toHaveBeenCalledWith({ data: { status: "OK" } });
  });

  it("Returns whatever string i18n.t returns as data.status", async () => {
    const req = createMockRequest("Service is running");
    const res = createMockResponse();
    await getHealthController(req, res);
    expect(res.json).toHaveBeenCalledWith({
      data: { status: "Service is running" },
    });
  });
});
