import {
  DeleteOutlined,
  EditOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { useBoolean } from "@force-dev/react";
import { Modal, Space, Table, TableProps } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useMemo, useState } from "react";

import { ClientModel } from "~@models";
import { IClient, ICreateClientRequest, IUpdateClientRequest } from "~@service";

import { ClientForm, TClientForm } from "../forms";
import { Button, useConfirmModal } from "../ui";
import { ClientConfiguration } from "../сlientConfiguration";
import { clientListColumns } from "./columns";

interface IProps {
  serverId?: string;
  data: ClientModel[];
  loading?: boolean;
  onDelete?: (clientId: string) => void | Promise<void>;
  onUpdate?: (
    clientId: string,
    data: IUpdateClientRequest,
  ) => void | Promise<void>;
  onCreate?: (data: ICreateClientRequest) => void | Promise<void>;
}

export const ClientList: FC<IProps> = observer(
  ({ serverId, data, loading, onUpdate, onCreate, onDelete }) => {
    const [createOpen, onCreateOpen, onCreateClose] = useBoolean();
    const [editClient, setEditClient] = useState<IClient>();

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

    const handleCreate = useCallback(
      async (data: TClientForm) => {
        if (serverId) {
          await onCreate?.({ serverId, ...data });
          onCreateClose();
        }
      },
      [serverId, onCreate, onCreateClose],
    );

    const handleUpdate = useCallback(
      async (data: TClientForm) => {
        if (editClient) {
          await onUpdate?.(editClient.id, data);
          setEditClient(undefined);
        }
      },
      [editClient, onUpdate],
    );

    const handleClose = useCallback(() => {
      onCreateClose();
      setEditClient(undefined);
    }, [onCreateClose]);

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
                {onUpdate && (
                  <EditOutlined
                    onClick={() => setEditClient(data)}
                    className={"cursor-pointer"}
                  />
                )}
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
      [handleDelete, onUpdate],
    );

    if (!serverId) {
      return (
        <div className={"flex justify-center p-4"}>
          <div>{"Выберете сервер"}</div>
        </div>
      );
    }

    return (
      <>
        <div className={"flex justify-end mb-3"}>
          {onCreate && (
            <Button type={"link"} onClick={onCreateOpen}>
              {"Добавить клиента"}
            </Button>
          )}
        </div>
        <Table
          rowKey={({ data }) => data.id}
          columns={_columns}
          dataSource={data}
          loading={loading}
          size={"small"}
          bordered
          pagination={false}
        />
        <Modal
          open={createOpen || !!editClient}
          title={editClient ? "Редактирование" : "Создать клиента"}
          footer={false}
          destroyOnClose={true}
          maskClosable={false}
          onCancel={handleClose}
        >
          <ClientForm
            client={editClient}
            onSubmit={editClient ? handleUpdate : handleCreate}
          />
        </Modal>
      </>
    );
  },
);
