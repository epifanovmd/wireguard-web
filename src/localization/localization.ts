import "dayjs/locale/ru.js";
import "dayjs/locale/en.js";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { enLocale, ruLocale } from "./locales";

dayjs.extend(localizedFormat);

export const languageList: Record<ILanguageType, string> = {
  ru: "Русский",
  en: "English",
};

export type ILanguageType = "ru" | "en";

export const langResources = {
  ru: { translation: { ...ruLocale } },
  en: { translation: { ...enLocale } },
};

export interface IInitLocalizationParams {
  initLang?: ILanguageType | string;
  isServer?: boolean;
}

export const initLocalization = ({
  initLang = "ru",
  isServer,
}: IInitLocalizationParams) => {
  const LngDetector = new LanguageDetector(null, { caches: ["localStorage"] });

  dayjs.locale(initLang);
  if (isServer) {
    return i18next.init({
      fallbackLng: initLang,
      lng: initLang,
      interpolation: {
        escapeValue: false,
        prefix: "",
      },
      debug: false,
      load: "languageOnly",
      resources: langResources,
    });
  }

  return i18next
    .use(LngDetector)
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v3",
      fallbackLng: initLang,
      lng: initLang,
      debug: false,
      load: "languageOnly",
      interpolation: {
        escapeValue: false,
        prefix: "",
      },
      resources: langResources,
    })
    .then();
};

export const i18n = i18next;
