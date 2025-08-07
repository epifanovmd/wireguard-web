import React, { FC, memo, useEffect, useRef, useState } from "react";

import { bytes } from "~@common";

export const TransferTxRx: FC<{ value: number }> = memo(({ value }) => {
  const timeoutId = useRef<number>(undefined);
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
    <div className={"flex-grow basis-0 whitespace-nowrap"}>
      {value !== 0 &&
        `${bytes(value)} ${parseFloat(current) > 0 ? `- ${current}/s` : ""}`}
    </div>
  );
});
