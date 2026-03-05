import { STATUS_CODES } from "@/constants/status-codes";
import { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandlerMiddleware } from "./error-handler-middleware";

vi.mock("@/prisma", () => ({
  prisma: {
    apiErrorLog: {
      create: vi.fn(),
    },
  },
}));

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    url: "http://localhost/foo?bar=1",
    hostname: "localhost",
    path: "/foo",
    method: "GET",
    body: { key: "value" },
    sessionUser: undefined,
    ...overrides,
  } as unknown as Request;
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

describe("errorHandlerMiddleware", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { prisma } = await import("@/prisma");
    vi.mocked(prisma.apiErrorLog.create).mockResolvedValue({} as never);
  });

  it("Logs error and responds with given statusCode and message when err has statusCode and message", async () => {
    const err = {
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Validation failed",
      stack: "Error: Validation failed\n  at ...",
    };
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const { prisma } = await import("@/prisma");

    await errorHandlerMiddleware(err, req, res, next);

    expect(prisma.apiErrorLog.create).toHaveBeenCalledTimes(1);
    expect(prisma.apiErrorLog.create).toHaveBeenCalledWith({
      data: {
        service: "AUTH",
        statusCode: STATUS_CODES.BAD_REQUEST,
        errorMessage: "Validation failed",
        errorStack: err.stack,
        requestUrl: "http://localhost/foo?bar=1",
        requestUrlHostname: "localhost",
        requestUrlPath: "/foo",
        requestUrlSearch: "bar=1",
        requestBody: JSON.stringify({ key: "value" }),
        requestMethod: "GET",
        userId: undefined,
        createdBy: undefined,
      },
    });
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: STATUS_CODES.BAD_REQUEST.toString(),
        message: "Validation failed",
      },
    });
  });

  it("Uses INTERNAL_SERVER_ERROR when err.statusCode is missing", async () => {
    const err = { message: "Something broke" };
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();

    await errorHandlerMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString(),
        message: "Something broke",
      },
    });
  });

  it("Uses default message when err.message is missing", async () => {
    const err = { statusCode: STATUS_CODES.NOT_FOUND };
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const { prisma } = await import("@/prisma");

    await errorHandlerMiddleware(err, req, res, next);

    expect(prisma.apiErrorLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          errorMessage: "Internal Server Error",
        }),
      })
    );
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: STATUS_CODES.NOT_FOUND.toString(),
        message: "Internal Server Error",
      },
    });
  });

  it("Passes sessionUser id as userId and createdBy when req.sessionUser is set", async () => {
    const err = {
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: "Unauthorized",
    };
    const req = createMockRequest({
      sessionUser: { id: "user-123" } as never,
    });
    const res = createMockResponse();
    const next = createMockNext();
    const { prisma } = await import("@/prisma");

    await errorHandlerMiddleware(err, req, res, next);

    expect(prisma.apiErrorLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user-123",
        createdBy: "user-123",
      }),
    });
  });

  it("Responds with 500 and generic message when prisma.apiErrorLog.create throws", async () => {
    const err = {
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: "Bad request",
    };
    const req = createMockRequest();
    const res = createMockResponse();
    const next = createMockNext();
    const { prisma } = await import("@/prisma");
    const logError = new Error("Database connection failed");
    vi.mocked(prisma.apiErrorLog.create).mockRejectedValue(logError);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await errorHandlerMiddleware(err, req, res, next);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error while logging error:",
      logError
    );
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: STATUS_CODES.INTERNAL_SERVER_ERROR.toString(),
        message: "Internal Server Error",
      },
    });
    expect(result).toBe(res);
    consoleSpy.mockRestore();
  });

  it("Serializes request body for log when req.body is present", async () => {
    const err = { statusCode: STATUS_CODES.OK, message: "OK" };
    const req = createMockRequest({ body: { a: 1, b: "two" } });
    const res = createMockResponse();
    const next = createMockNext();
    const { prisma } = await import("@/prisma");

    await errorHandlerMiddleware(err, req, res, next);

    expect(prisma.apiErrorLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        requestBody: JSON.stringify({ a: 1, b: "two" }),
      }),
    });
  });
});
