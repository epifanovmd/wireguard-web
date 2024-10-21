import { observer } from "mobx-react-lite";
import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";

import { ClientModel } from "~@models";

export interface IOnlineProps {
  client: ClientModel;
}

const _Online: FC<PropsWithChildren<IOnlineProps>> = ({ client }) => {
  const timeoutId = useRef<number>();
  const [prev, setPrev] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const tx = client.data.transferTx ?? 0;
    const rx = client.data.transferRx ?? 0;

    if (prev) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      setCurrent(tx + rx);

      timeoutId.current = setTimeout(() => {
        setPrev(prev);
        setCurrent(prev);
      }, 25000) as never;
    } else {
      setPrev(tx + rx);
    }

    return () => {
      setPrev(tx + rx);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client.data.transferTx, client.data.transferRx]);

  const online = prev !== 0 && current !== 0 && prev !== current;

  return (
    <a className={"flex items-center"}>
      {
        <span
          className={"mr-1 rounded h-2 w-2 bg-green-500"}
          style={{ background: online ? "#22c55e" : "#ef6f66" }}
        />
      }
      <span className={"overflow-hidden overflow-ellipsis whitespace-nowrap"}>
        {client.name}
      </span>
    </a>
  );
};

export const Online = observer(_Online);
