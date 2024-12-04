import { TableProps } from "antd";
import React, { FC, Fragment, memo, PropsWithChildren } from "react";

import { ClientModel } from "~@models";

export interface IClientCardProps {
  client: ClientModel;
  columns: TableProps<ClientModel>["columns"];
}

const _ClientCard: FC<PropsWithChildren<IClientCardProps>> = ({
  columns = [],
  client,
}) => {
  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-2 rounded-md gap-1 mb-2 pt-[48px] border-[1px] border-[#E7E7E7] p-[14px] relative"
      }
    >
      {columns.map(({ key, title, render }, index) => {
        if (key === "enabled") {
          return (
            <div key={index} className={"absolute top-[11px] left-[14px]"}>
              {render?.(null, client, index) as any}
            </div>
          );
        }

        if (key === "actions") {
          return (
            <div key={index} className={"absolute top-[11px] right-[14px]"}>
              {render?.(null, client, index) as any}
            </div>
          );
        }

        return (
          <Fragment key={index}>
            <div className={"mr-2"}>{`${title}:`}</div>
            <div className={"font-bold f"}>
              {render?.(null, client, index) as any}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export const ClientCard = memo(_ClientCard);
