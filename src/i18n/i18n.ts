import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "@/i18n/translations/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
  },
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
