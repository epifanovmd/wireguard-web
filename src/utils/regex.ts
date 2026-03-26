export const EMAIL_REGEX = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
export const PHONE_REGEX = new RegExp(/^(\+7|7|8)?9\d{9}$/);

export const isEmail = (value: string): boolean => {
  return EMAIL_REGEX.test(value);
};

export const isPhone = (value: string): boolean => {
  return PHONE_REGEX.test(value);
};
