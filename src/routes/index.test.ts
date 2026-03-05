import type { Express } from "express";
import { describe, expect, it, vi } from "vitest";

const mockUse = vi.fn();
const mockApp = { use: mockUse } as unknown as Express;

const mockHealthRoutes = { __mockId: "health" } as unknown as ReturnType<
  typeof import("express").Router
>;

vi.mock("./health", () => ({
  healthRoutes: mockHealthRoutes,
}));

describe("routes", () => {
  it("Mounts health routes at root prefix once", async () => {
    mockUse.mockClear();

    const { routes } = await import("./index");
    routes(mockApp);

    const healthCalls = mockUse.mock.calls.filter(
      (call) => call[1] === mockHealthRoutes
    );
    expect(healthCalls).toHaveLength(1);
    expect(mockUse).toHaveBeenCalledWith("/", mockHealthRoutes);
  });
});
