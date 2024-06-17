import { RecursiveObjectType } from "@force-dev/utils";
import dayjs from "dayjs";
import { changeLanguage, i18n as I18n, TFunction } from "i18next";
import { useTranslation as useT } from "react-i18next";

import { ruLocale } from "../locales";
import { ILanguageType } from "../localization";

export type II18nPaths = RecursiveObjectType<typeof ruLocale>;

export type Translation = {
  t: (path: II18nPaths, options?: object) => string;
  i18n: I18n;
  changeLanguage: (lang: ILanguageType | string) => Promise<TFunction>;
};

export const useTranslation = () => {
  const { t, i18n } = useT();

  return {
    changeLanguage: (lang: ILanguageType) => {
      dayjs.locale(lang);

      return changeLanguage(lang);
    },
    t,
    i18n,
  } as Translation;
};
