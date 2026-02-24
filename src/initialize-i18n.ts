import i18next from "i18next";
import i18nextFsBackend from "i18next-fs-backend";
import path from "path";

const initializeI18n = () => {
  i18next.use(i18nextFsBackend).init({
    fallbackLng: "en",
    preload: ["en", "nl"],
    ns: ["error-codes", "validations", "emails"],
    backend: {
      loadPath: path.join(__dirname, "..", "locales", "{{lng}}", "{{ns}}.json"),
    },
  });

  return i18next;
};

export { initializeI18n };
