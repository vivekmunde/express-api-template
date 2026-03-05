import { describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();
vi.mock("express", () => ({
  Router: vi.fn(() => ({ get: mockGet })),
}));

// Mock must accept controller argument when publicRouteHandler(getHealthController) is called
const mockPublicRouteHandler = vi.fn(() => vi.fn());
vi.mock("@/route-handlers/public-route-handler", () => ({
  publicRouteHandler: mockPublicRouteHandler,
}));

const mockGetHealthController = vi.fn();
vi.mock("./get/controller", () => ({
  getHealthController: mockGetHealthController,
}));

describe("health routes index", () => {
  it("Calls publicRouteHandler with getHealthController and registers GET /health with its return value", async () => {
    mockGet.mockClear();
    mockPublicRouteHandler.mockClear();
    mockPublicRouteHandler.mockImplementation(() => vi.fn());

    const { healthRoutes } = await import("./index");

    expect(mockPublicRouteHandler).toHaveBeenCalledTimes(1);
    expect(mockPublicRouteHandler).toHaveBeenCalledWith(
      mockGetHealthController
    );
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith(
      "/health",
      mockPublicRouteHandler.mock.results[0].value
    );
    expect(healthRoutes.get).toBe(mockGet);
  });
});
