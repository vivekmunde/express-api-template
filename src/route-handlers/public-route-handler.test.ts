import { User } from "@prisma/client";
import { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { publicRouteHandler } from "./public-route-handler";

function createMockRequest(sessionUser?: User): Request {
  return { sessionUser } as unknown as Request;
}

function createMockResponse(): Response {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
}

describe("publicRouteHandler", () => {
  it("Invokes the controller with req, res, and context containing undefined sessionUser when request has no session", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn();
    const controller = vi.fn().mockResolvedValue(res);
    const middleware = publicRouteHandler(controller);
    await middleware(req, res, next);
    expect(controller).toHaveBeenCalledWith(req, res, {
      sessionUser: undefined,
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("Invokes the controller with req, res, and context containing sessionUser when request is authenticated", async () => {
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
    const middleware = publicRouteHandler(controller);
    await middleware(req, res, next);
    expect(controller).toHaveBeenCalledWith(req, res, { sessionUser: user });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("Returns the result of the controller when it resolves", async () => {
    const req = createMockRequest();
    const res = createMockResponse();
    const next = vi.fn();
    const controller = vi.fn().mockResolvedValue(res);
    const middleware = publicRouteHandler(controller);
    const result = await middleware(req, res, next);
    expect(result).toBe(res);
  });
});
