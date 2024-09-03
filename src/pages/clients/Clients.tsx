import { useBoolean } from "@force-dev/react";
import { Modal } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useCallback } from "react";

import { Button, ClientList } from "~@components";

import { ClientForm, TClientForm } from "../../components/forms";
import { useClientsVM } from "./hooks";

interface IProps {}

export const ClientsPage: FC<PropsWithChildren<IProps>> = observer(() => {
  const [open, onOpen, onClose] = useBoolean();

  const { list, loading, createClient, deleteClient } = useClientsVM();

  const handleSubmit = useCallback(
    async (data: TClientForm) => {
      await createClient(data);
      onClose();
    },
    [createClient, onClose],
  );

  return (
    <div>
      <div className={"flex justify-end mb-3"} onClick={onOpen}>
        <Button>{"Добавить"}</Button>
      </div>

      <ClientList data={list} loading={loading} onDelete={deleteClient} />

      <Modal
        open={open}
        title={"Создать клиента"}
        footer={false}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={onClose}
      >
        <ClientForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
});
