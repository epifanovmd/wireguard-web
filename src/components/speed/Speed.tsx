import React, { FC, useEffect, useRef, useState } from "react";

import { bytes } from "~@common";

export const Speed: FC<{ value: number }> = ({ value }) => {
  const timeoutId = useRef<number>();
  const [prev, setPrev] = useState(0);
  const [current, setCurrent] = useState("0");

  useEffect(() => {
    if (prev) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      setCurrent(bytes(value - prev));

      timeoutId.current = setTimeout(() => {
        setCurrent("0");
      }, 2000) as never;
    }

    setPrev(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div style={{ flexGrow: 1, flexBasis: 0 }}>
      {value !== 0 &&
        `${bytes(value)} ${parseFloat(current) > 0 ? `- ${current}/s` : ""}`}
    </div>
  );
};
