import { STATUS_CODES } from "@/constants/status-codes";
import { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { corsErrorHandlerMiddleware } from "./cors-error-handler-middleware";

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

describe("corsErrorHandlerMiddleware", () => {
  it("Responds with 403 and empty json when error message is NOT_ALLOWED_BY_CORS", () => {
    const err = new Error("NOT_ALLOWED_BY_CORS");
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    corsErrorHandlerMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.FORBIDDEN);
    expect(res.json).toHaveBeenCalledWith({});
    expect(next).not.toHaveBeenCalled();
  });

  it("Calls next with the error when error message is not NOT_ALLOWED_BY_CORS", () => {
    const err = new Error("OTHER_ERROR");
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    corsErrorHandlerMiddleware(err, req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(err);
  });

  it("Calls next with the thrown error when sending CORS response throws", () => {
    const err = new Error("NOT_ALLOWED_BY_CORS");
    const req = createMockRequest();
    const sendError = new Error("Response already sent");
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockImplementation(() => {
        throw sendError;
      }),
    } as unknown as Response;
    const next = createMockNext();
    corsErrorHandlerMiddleware(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.FORBIDDEN);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(sendError);
  });
});
