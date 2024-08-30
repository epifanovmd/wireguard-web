import { Table, TableProps, Tag } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC } from "react";

import { ClientModel } from "~@models";

import { Speed } from "../speed";

interface IProps {
  data: ClientModel[];
  loading?: boolean;
}

const columns: TableProps<ClientModel>["columns"] = [
  {
    title: "Имя",
    dataIndex: "name",
    key: "name",
    render: text => <a>{text}</a>,
  },
  {
    title: "Статус",
    dataIndex: "enabled",
    key: "enabled",
    render: (_, { enabled }) => (
      <Tag color={enabled === "Активен" ? "success" : "error"}>{enabled}</Tag>
    ),
  },
  {
    title: "transferRx",
    dataIndex: "transferRx",
    key: "transferRx",
    width: "200px",
    render: (_, { data }) => <Speed value={data.transferRx ?? 0} />,
  },
  {
    title: "transferTx",
    dataIndex: "transferTx",
    key: "transferTx",
    width: "200px",
    render: (_, { data }) => <Speed value={data.transferTx ?? 0} />,
  },
  {
    title: "Дата",
    key: "date",
    dataIndex: "date",
    render: (_, { date }) => <div>{date.formatted}</div>,
  },
];

export const ClientList: FC<IProps> = observer(({ data, loading }) => {
  return (
    <Table
      rowKey={({ name }) => name}
      columns={columns}
      dataSource={data}
      loading={loading}
      size={"small"}
      bordered
      pagination={false}
    />
  );
});
