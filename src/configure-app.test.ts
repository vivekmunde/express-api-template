import type { Express } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUse = vi.fn();
const mockApp = { use: mockUse } as unknown as Express;

const mockCorsMiddleware = vi.fn();
const mockCors = vi.fn(() => mockCorsMiddleware);

const mockCookieParserMiddleware = vi.fn();
const mockCookieParser = vi.fn(() => mockCookieParserMiddleware);

const mockJsonMiddleware = vi.fn();
const mockExpressJson = vi.fn(() => mockJsonMiddleware);

const mockI18nInstance = Symbol("i18nInstance");
const mockInitializeI18n = vi.fn(() => mockI18nInstance);

const mockI18nMiddleware = vi.fn();
const mockI18nHandle = vi.fn(() => mockI18nMiddleware);

const mockCorsErrorHandlerMiddleware = vi.fn();
const mockErrorHandlerMiddleware = vi.fn();
const mockRoutes = vi.fn();

const mockCorsOptions = { origin: true, credentials: true };

vi.mock("@/cors-options", () => ({
  corsOptions: mockCorsOptions,
}));

vi.mock("@/initialize-i18n", () => ({
  initializeI18n: mockInitializeI18n,
}));

vi.mock("@/middlewares/cors-error-handler-middleware", () => ({
  corsErrorHandlerMiddleware: mockCorsErrorHandlerMiddleware,
}));

vi.mock("@/middlewares/error-handler-middleware", () => ({
  errorHandlerMiddleware: mockErrorHandlerMiddleware,
}));

vi.mock("@/routes", () => ({
  routes: mockRoutes,
}));

vi.mock("cookie-parser", () => ({
  default: mockCookieParser,
}));

vi.mock("cors", () => ({
  default: mockCors,
}));

vi.mock("express", () => ({
  default: {
    json: mockExpressJson,
  },
}));

vi.mock("i18next-http-middleware", () => ({
  default: {
    handle: mockI18nHandle,
  },
}));

describe("configureApp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Returns the same Express app instance", async () => {
    const { configureApp } = await import("./configure-app");

    const result = configureApp(mockApp);

    expect(result).toBe(mockApp);
  });

  it("Registers middlewares and routes in the correct sequence", async () => {
    const { configureApp } = await import("./configure-app");

    configureApp(mockApp);

    expect(mockUse).toHaveBeenCalledTimes(6);
    expect(mockUse).toHaveBeenNthCalledWith(1, mockCorsMiddleware);
    expect(mockUse).toHaveBeenNthCalledWith(2, mockCookieParserMiddleware);
    expect(mockUse).toHaveBeenNthCalledWith(3, mockJsonMiddleware);
    expect(mockUse).toHaveBeenNthCalledWith(4, mockI18nMiddleware);
    expect(mockUse).toHaveBeenNthCalledWith(5, mockCorsErrorHandlerMiddleware);
    expect(mockUse).toHaveBeenNthCalledWith(6, mockErrorHandlerMiddleware);
  });

  it("Uses cors with corsOptions as the first middleware", async () => {
    const { configureApp } = await import("./configure-app");

    configureApp(mockApp);

    expect(mockCors).toHaveBeenCalledTimes(1);
    expect(mockCors).toHaveBeenCalledWith(mockCorsOptions);
  });

  it("Uses cookieParser with no arguments", async () => {
    const { configureApp } = await import("./configure-app");

    configureApp(mockApp);

    expect(mockCookieParser).toHaveBeenCalledTimes(1);
    expect(mockCookieParser).toHaveBeenCalledWith();
  });

  it("Uses express.json with no arguments", async () => {
    const { configureApp } = await import("./configure-app");

    configureApp(mockApp);

    expect(mockExpressJson).toHaveBeenCalledTimes(1);
    expect(mockExpressJson).toHaveBeenCalledWith();
  });

  it("Initializes i18n and uses i18next-http-middleware handle with its result", async () => {
    const { configureApp } = await import("./configure-app");

    configureApp(mockApp);

    expect(mockInitializeI18n).toHaveBeenCalledTimes(1);
    expect(mockInitializeI18n).toHaveBeenCalledWith();
    expect(mockI18nHandle).toHaveBeenCalledTimes(1);
    expect(mockI18nHandle).toHaveBeenCalledWith(mockI18nInstance);
  });

  it("Calls routes with the app after CORS and body/cookie middlewares and before error handler", async () => {
    const { configureApp } = await import("./configure-app");

    configureApp(mockApp);

    expect(mockRoutes).toHaveBeenCalledTimes(1);
    expect(mockRoutes).toHaveBeenCalledWith(mockApp);
    const useCallOrder = mockUse.mock.invocationCallOrder;
    const routesCallOrder = mockRoutes.mock.invocationCallOrder[0];
    const lastUseOrder = useCallOrder[useCallOrder.length - 1];
    expect(useCallOrder[4]).toBeLessThan(routesCallOrder);
    expect(routesCallOrder).toBeLessThan(lastUseOrder);
  });

  it("Registers error handler middleware last so unhandled errors are caught", async () => {
    const { configureApp } = await import("./configure-app");

    configureApp(mockApp);

    const lastUseCall = mockUse.mock.calls[mockUse.mock.calls.length - 1];
    expect(lastUseCall).toEqual([mockErrorHandlerMiddleware]);
  });
});
