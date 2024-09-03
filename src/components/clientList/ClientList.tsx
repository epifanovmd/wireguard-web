import {
  DeleteOutlined,
  EditOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { Modal, Space, Table, TableProps, Tag } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useMemo } from "react";

import { ClientModel } from "~@models";

import { Speed } from "../speed";
import { useConfirmModal } from "../ui";
import { ClientConfiguration } from "../сlientConfiguration";

interface IProps {
  data: ClientModel[];
  loading?: boolean;
  onDelete?: (clientId: string) => void | Promise<void>;
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
    title: "Дата и вреся последнего подключения",
    key: "date",
    dataIndex: "date",
    render: (_, { date }) => <div>{date.formatted}</div>,
  },
];

export const ClientList: FC<IProps> = observer(
  ({ data, loading, onDelete }) => {
    const { onConfirm } = useConfirmModal();

    const handleDelete = useCallback(
      async (clientId: string) => {
        await onConfirm({
          title: "Удаление клиента",
          question: "Продолжить?",
          description: "Клиент будет удален безвовратно",
          onSubmit: async () => {
            await onDelete?.(clientId);
          },
        });
      },
      [onConfirm, onDelete],
    );

    const _columns = useMemo<TableProps<ClientModel>["columns"]>(
      () => [
        ...columns,
        {
          title: "Дата",
          key: "date",
          dataIndex: "date",
          render: (_, { data }) => (
            <div>
              <Space>
                <QrcodeOutlined
                  className={"cursor-pointer"}
                  onClick={() => {
                    Modal.success({
                      title: "Отсканируйте QR код",
                      icon: null,
                      closable: true,
                      content: <ClientConfiguration clientId={data.id} />,
                      okText: "Готово",
                    });
                  }}
                />
                <EditOutlined className={"cursor-pointer"} />
                <DeleteOutlined
                  color={"danger"}
                  className={"cursor-pointer"}
                  onClick={() => handleDelete(data.id)}
                />
              </Space>
            </div>
          ),
        },
      ],
      [handleDelete],
    );

    return (
      <Table
        rowKey={({ name }) => name}
        columns={_columns}
        dataSource={data}
        loading={loading}
        size={"small"}
        bordered
        pagination={false}
      />
    );
  },
);
