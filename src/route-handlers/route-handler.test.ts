import { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { routeHandler } from "./route-handler";

function createMockRequest(): Request {
  return {} as unknown as Request;
}

function createMockResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

function createMockNext(): NextFunction {
  return vi.fn();
}

describe("routeHandler", () => {
  it("Returns middleware that invokes the controller and returns its result when it resolves", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const fn = vi.fn().mockResolvedValue(res);
    const middleware = routeHandler(fn);
    const result = await middleware(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res);
    expect(next).not.toHaveBeenCalled();
    expect(result).toBe(res);
  });

  it("Calls next with the rejection when the controller rejects", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const error = new Error("Controller error");
    const fn = vi.fn().mockRejectedValue(error);
    const middleware = routeHandler(fn);
    await middleware(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
