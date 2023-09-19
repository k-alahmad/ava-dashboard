import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const lnglocal = localStorage.getItem("lng");

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: {},
    },
    en: {
      translation: {},
    },
  },
  // lng: lnglocal ?? "en",
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
