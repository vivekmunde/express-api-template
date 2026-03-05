import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUse = vi.fn();
const mockInit = vi.fn();

vi.mock("i18next", () => ({
  default: {
    use: mockUse,
    init: mockInit,
  },
}));

vi.mock("i18next-fs-backend", () => ({
  default: Symbol("i18nextFsBackend"),
}));

vi.mock("i18next-http-middleware", () => ({
  LanguageDetector: Symbol("LanguageDetector"),
}));

describe("initializeI18n", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUse.mockReturnValue({
      use: mockUse,
      init: mockInit,
    });
  });

  it("Returns the i18next instance", async () => {
    const i18next = (await import("i18next")).default;
    const { initializeI18n } = await import("@/initialize-i18n");

    const result = initializeI18n();

    expect(result).toBe(i18next);
  });

  it("Registers i18next-fs-backend via use", async () => {
    const i18nextFsBackend = (await import("i18next-fs-backend")).default;
    const { initializeI18n } = await import("@/initialize-i18n");

    initializeI18n();

    expect(mockUse).toHaveBeenCalledWith(i18nextFsBackend);
  });

  it("Registers LanguageDetector via use", async () => {
    const { LanguageDetector } = await import("i18next-http-middleware");
    const { initializeI18n } = await import("@/initialize-i18n");

    initializeI18n();

    expect(mockUse).toHaveBeenCalledWith(LanguageDetector);
  });

  it("Calls init with fallbackLng and preload", async () => {
    const { initializeI18n } = await import("@/initialize-i18n");

    initializeI18n();

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLng: "en",
        preload: ["en"],
      })
    );
  });

  it("Calls init with ns set to word", async () => {
    const { initializeI18n } = await import("@/initialize-i18n");

    initializeI18n();

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        ns: ["word"],
      })
    );
  });

  it("Calls init with backend loadPath under locales for lng and ns placeholders", async () => {
    const { initializeI18n } = await import("@/initialize-i18n");

    initializeI18n();

    const initOptions = mockInit.mock.calls[0][0];
    expect(initOptions.backend).toBeDefined();
    expect(initOptions.backend.loadPath).toContain("locales");
    expect(initOptions.backend.loadPath).toContain("{{lng}}");
    expect(initOptions.backend.loadPath).toContain("{{ns}}.json");
  });

  it("Calls init with detection order querystring, cookie, header", async () => {
    const { initializeI18n } = await import("@/initialize-i18n");

    initializeI18n();

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        detection: expect.objectContaining({
          order: ["querystring", "cookie", "header"],
          lookupQuerystring: "lng",
          lookupCookie: "i18next",
          caches: ["cookie"],
        }),
      })
    );
  });
});
