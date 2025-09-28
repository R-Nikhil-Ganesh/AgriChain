// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import or from "./locales/or.json";

const LANGUAGE_KEY = "APP_LANGUAGE";

// Safe fallback for device locale
const deviceLocale = Localization.locale || "en";

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    lng: deviceLocale.startsWith("or") ? "or" : "en", // safe check
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      or: { translation: or },
    },
    interpolation: { escapeValue: false },
  });

// Change language and persist in AsyncStorage
export const changeAppLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    i18n.changeLanguage(lang);
  } catch (e) {
    console.log("Error changing language:", e);
  }
};

// Load saved language at app start
export const loadSavedLanguage = async () => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  } catch (e) {
    console.log("Error loading saved language:", e);
  }
};

export default i18n;