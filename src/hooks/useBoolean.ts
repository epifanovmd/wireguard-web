import { useCallback, useState } from "react";

type BooleanReturn = [boolean, () => void, () => void];

export const useBoolean = (): BooleanReturn => {
  const [value, setValue] = useState(false);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, setTrue, setFalse];
};
