import { DeleteOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Modal, Space, Table, TableProps } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useMemo } from "react";

import { ClientModel } from "~@models";

import { useConfirmModal } from "../ui";
import { ClientConfiguration } from "../сlientConfiguration";
import { clientListColumns } from "./columns";

interface IProps {
  data: ClientModel[];
  loading?: boolean;
  onDelete?: (clientId: string) => void | Promise<void>;
}

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
        ...clientListColumns,
        {
          title: "Действия",
          key: "actions",
          dataIndex: "actions",
          render: (_, { data }) => (
            <div>
              <Space className={"flex justify-center"}>
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
                {/* <EditOutlined className={"cursor-pointer"} />*/}
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
