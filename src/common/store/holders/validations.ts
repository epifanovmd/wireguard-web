import { isArray, isNumber, isString } from "../../helpers";

export const usernameRegex =
  /^[\d\+][\d\(\)\ -]{4,14}\d$|^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
export const passwordRegex =
  /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const validateLength =
  (length: { min?: number; max?: number }, message?: string) =>
  <T extends any>(value?: T) => {
    if (isArray(value) || isString(value)) {
      if (isNumber(length.max) && value && value.length > length.max) {
        return message || `Макимальная длинна ${length.max}`;
      }
      if (isNumber(length.min) && value && value.length < length.min) {
        return message || `Минимальная длинна ${length.min}`;
      }
    }

    if (isNumber(value)) {
      if (isNumber(length.max) && value && value > length.max) {
        return message || `Значение больше ${length.max}`;
      }
      if (isNumber(length.min) && value && value < length.min) {
        return message || `Значение меньше ${length.min}`;
      }
    }

    return "";
  };

export const validateRequired =
  (message?: string) =>
  <T extends any>(value?: T) => {
    if (!value) {
      return message || "Поле является обязательным";
    }

    return "";
  };

export const validateRegex =
  (regex: RegExp, message?: string) =>
  (value: string = "") => {
    if (!regex.test(value)) {
      return message || "Невалидный ввод";
    }

    return "";
  };
