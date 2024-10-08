import { useBoolean } from "@force-dev/react";
import { Modal, Spin, Tabs } from "antd";
import { isString } from "lodash";
import React, {
  FC,
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
} from "react";

import { ServerModel } from "~@models";
import { ICreateServerRequest } from "~@service";
import { useProfileDataStore } from "~@store";

import { ServerForm, TServerForm } from "../forms";
import { useConfirmModal } from "../ui";

export interface IServerListProps {
  serverId?: string;
  items: ServerModel[];
  loading?: boolean;
  onServerSelect: (serverId: string) => void;
  onCreate?: (data: ICreateServerRequest) => Promise<void> | void;
  onDelete?: (serverId: string) => Promise<void> | void;
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
  const { isAdmin } = useProfileDataStore();

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
          try {
            await onDelete?.(serverId);
          } catch {
            onClose();
          }
        },
      });
    },
    [onClose, onConfirm, onDelete],
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

  const tabs = useMemo(
    () =>
      items.map(item => ({
        key: item.data.id,
        label: item.data.name,
      })),
    [items],
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
          items={tabs}
          hideAdd={!isAdmin}
          removeIcon={isAdmin ? undefined : <div />}
          onEdit={isAdmin ? onEdit : undefined}
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
