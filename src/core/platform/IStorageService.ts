import { createServiceDecorator } from "@di";

/**
 * Абстракция key-value хранилища.
 * Web: localStorage. React Native: AsyncStorage / MMKV.
 */
export interface IStorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const IStorageService = createServiceDecorator<IStorageService>();

@IStorageService({ inSingleton: true })
export class WebStorageService implements IStorageService {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
