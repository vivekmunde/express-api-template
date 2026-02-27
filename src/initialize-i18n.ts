import i18next from "i18next";
import i18nextFsBackend from "i18next-fs-backend";
import { LanguageDetector } from "i18next-http-middleware";
import path from "path";

/**
 * Initializes i18next with file-based backend and HTTP middleware detection.
 * Language is detected from querystring, cookie, then header; result is
 * cached in cookie. Must be called before using i18next (e.g. in app setup).
 *
 * @returns Initialized i18next instance for use with i18next-http-middleware
 */
const initializeI18n = () => {
  i18next
    .use(i18nextFsBackend)
    .use(LanguageDetector)
    .init({
      fallbackLng: "en",
      preload: ["en"],
      ns: ["word"],
      backend: {
        loadPath: path.join(__dirname, "locales", "{{lng}}", "{{ns}}.json"),
      },
      detection: {
        order: ["querystring", "cookie", "header"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        caches: ["cookie"],
      },
    });

  return i18next;
};

export { initializeI18n };
