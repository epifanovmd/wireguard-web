import { ClientModel } from "@models";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";

import { Speed } from "../speed";

interface IProps {
  data: ClientModel[];
}

export const ClientList: FC<IProps> = observer(({ data }) => {
  return (
    <div>
      {data.map(item => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
          key={item.data.id}
        >
          <div style={{ flexGrow: 1, flexBasis: 0 }}>{item.name}</div>
          <div style={{ flexGrow: 1, flexBasis: 0 }}>{`${item.enabled}`}</div>
          <Speed value={item.data.transferRx ?? 0} />
          <Speed value={item.data.transferTx ?? 0} />

          <div style={{ flexGrow: 1, flexBasis: 0 }}>{item.date.formatted}</div>
        </div>
      ))}
    </div>
  );
});
