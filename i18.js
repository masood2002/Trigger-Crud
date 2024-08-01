import i18n from "i18n";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
i18n.configure({
  locales: ["en", "es"],
  directory: __dirname + "/locales",
  defaultLocale: "en",
  cookie: "lang",
  queryParameter: "lang",
  autoReload: true,
  syncFiles: true,
  logDebugFn: function (msg) {
    console.log("i18n debug:", msg);
  },
  logWarnFn: function (msg) {
    console.warn("i18n warn:", msg);
  },
  logErrorFn: function (msg) {
    console.error("i18n error:", msg);
  },
});

export default i18n;
