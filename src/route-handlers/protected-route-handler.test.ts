import { STATUS_CODES } from "@/constants/status-codes";
import { User } from "@prisma/client";
import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { protectedRouteHandler } from "./protected-route-handler";

function createMockRequest(sessionUser?: User): Request {
  return { sessionUser } as unknown as Request;
}

function createMockResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

describe("protectedRouteHandler", () => {
  it("Returns 401 and empty json when sessionUser is missing", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn();
    const controller = vi.fn();
    const middleware = protectedRouteHandler(controller);
    await middleware(req, res, next);
    expect(controller).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({});
  });

  it("Returns 401 and empty json when sessionUser exists but has no id", async () => {
    const userWithoutId = { id: undefined } as unknown as User;
    const req = createMockRequest(userWithoutId);
    const res = createMockResponse();
    const next = vi.fn();
    const controller = vi.fn();
    const middleware = protectedRouteHandler(controller);
    await middleware(req, res, next);
    expect(controller).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({});
  });

  it("Invokes the controller with req, res, and context containing sessionUser when session is valid", async () => {
    const user: User = {
      id: "user-1",
      email: "a@b.com",
      name: null,
      createdAt: new Date(1000),
      createdBy: "creator-1",
      updatedAt: new Date(2000),
      updatedBy: null,
    };
    const req = createMockRequest(user);
    const res = createMockResponse();
    const next = vi.fn();
    const controller = vi.fn().mockResolvedValue(res);
    const middleware = protectedRouteHandler(controller);
    await middleware(req, res, next);
    expect(controller).toHaveBeenCalledWith(req, res, { sessionUser: user });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("Returns the result of the controller when session is valid", async () => {
    const user: User = {
      id: "user-1",
      email: "a@b.com",
      name: null,
      createdAt: new Date(1000),
      createdBy: "creator-1",
      updatedAt: new Date(2000),
      updatedBy: null,
    };
    const req = createMockRequest(user);
    const res = createMockResponse();
    const next = vi.fn();
    const controller = vi.fn().mockResolvedValue(res);
    const middleware = protectedRouteHandler(controller);
    const result = await middleware(req, res, next);
    expect(result).toBe(res);
  });
});
