import { describe, expect, it, vi } from "vitest";

const mockInstance = Object.freeze({ __prismaClient: true });
const MockPrismaClient = vi.fn(function (this: unknown) {
  return mockInstance;
});

vi.mock("@prisma/client", () => ({
  PrismaClient: MockPrismaClient,
}));

describe("prisma", () => {
  it("Exports a single prisma instance", async () => {
    vi.resetModules();
    const { prisma } = await import("@/prisma");

    expect(prisma).toBe(mockInstance);
  });

  it("Instantiates PrismaClient exactly once when the module is loaded", async () => {
    vi.resetModules();
    MockPrismaClient.mockClear();

    await import("@/prisma");

    expect(MockPrismaClient).toHaveBeenCalledTimes(1);
  });

  it("Exported prisma is the instance returned by PrismaClient", async () => {
    vi.resetModules();
    MockPrismaClient.mockClear();
    MockPrismaClient.mockImplementation(function (this: unknown) {
      return mockInstance;
    });

    const { prisma } = await import("@/prisma");

    expect(MockPrismaClient).toHaveBeenCalledTimes(1);
    expect(prisma).toBe(mockInstance);
  });
});
