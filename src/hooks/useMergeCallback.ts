import { useCallback } from "react";

type CallbackFunction<T extends any[]> = (...args: T) => void;

export const useMergedCallback = <T extends any[]>(
  ...callbacks: (CallbackFunction<T> | undefined)[]
): CallbackFunction<T> => {
  return useCallback((...args: T) => {
    callbacks.forEach(callback => {
      callback?.(...args);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, callbacks.filter(Boolean) as CallbackFunction<T>[]);
};
