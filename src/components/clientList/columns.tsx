import { Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";

import { Online, TransferTxRx } from "~@components";
import { ClientModel } from "~@models";

export const clientListColumns: ColumnsType<ClientModel> = [
  {
    title: "Имя",
    dataIndex: "name",
    key: "name",
    render: (_, client) => <Online client={client} />,
  },
  {
    title: "Статус",
    dataIndex: "enabled",
    key: "enabled",
    render: (_, { data }) => (
      <Tag color={data.enabled ? "success" : "error"}>
        {data.enabled ? "Активен" : "Отключен"}
      </Tag>
    ),
  },
  {
    title: "IP",
    dataIndex: "address",
    key: "address",
    render: (_, { data }) => <div>{data.address}</div>,
  },
  {
    title: "Загружено",
    dataIndex: "transferRx",
    key: "transferRx",
    width: "200px",
    render: (_, { data }) => <TransferTxRx value={data.transferRx ?? 0} />,
  },
  {
    title: "Скачано",
    dataIndex: "transferTx",
    key: "transferTx",
    width: "200px",
    render: (_, { data }) => <TransferTxRx value={data.transferTx ?? 0} />,
  },
  {
    title: "Дата / время последнего подключения",
    key: "date",
    dataIndex: "date",
    render: (_, { date }) => <div>{date.formatted}</div>,
  },
];
