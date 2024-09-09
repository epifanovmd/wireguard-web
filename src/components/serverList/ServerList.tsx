import { useBoolean } from "@force-dev/react";
import { Modal, Spin, Tabs } from "antd";
import { isString } from "lodash";
import React, { FC, memo, PropsWithChildren, useCallback } from "react";

import { ServerModel } from "~@models";
import { ICreateServerRequest } from "~@service";

import { ServerForm, TServerForm } from "../forms";
import { useConfirmModal } from "../ui";

export interface IServerListProps {
  serverId?: string;
  items: ServerModel[];
  loading?: boolean;
  onServerSelect: (serverId: string) => void;
  onCreate?: (data: ICreateServerRequest) => void;
  onDelete?: (serverId: string) => void;
}

const _ServerList: FC<PropsWithChildren<IServerListProps>> = ({
  serverId,
  items,
  loading,
  onServerSelect,
  onCreate,
  onDelete,
}) => {
  const [open, onOpen, onClose] = useBoolean();
  const { onConfirm } = useConfirmModal();

  const handleSubmit = useCallback(
    async (data: TServerForm) => {
      await onCreate?.({ ...data });
      onClose();
    },
    [onCreate, onClose],
  );

  const handleDelete = useCallback(
    async (serverId: string) => {
      await onConfirm({
        title: "Удаление сервера",
        question: "Продолжить?",
        description:
          "Сервер будет удален безвовратно, а так же все связанные с ним клиенты",
        submitTitle: "Удалить",
        onSubmit: async () => {
          await onDelete?.(serverId);
        },
      });
    },
    [onConfirm, onDelete],
  );

  const onEdit = useCallback(
    (
      targetKey: React.MouseEvent | React.KeyboardEvent | string,
      action: "add" | "remove",
    ) => {
      if (action === "add") {
        onCreate && onOpen();
      } else if (isString(targetKey)) {
        handleDelete(targetKey).then();
      }
    },
    [handleDelete, onCreate, onOpen],
  );

  return (
    <div>
      {loading ? (
        <div className={"flex justify-center"}>
          <Spin />
        </div>
      ) : (
        <Tabs
          type="editable-card"
          defaultActiveKey="1"
          activeKey={serverId}
          items={items.map(item => ({
            key: item.data.id,
            label: item.data.name,
          }))}
          onEdit={onEdit}
          onChange={id => onServerSelect(id)}
        />
      )}

      <Modal
        open={open}
        title={"Добавить сервер"}
        footer={false}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={onClose}
      >
        <ServerForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export const ServerList = memo(_ServerList);
