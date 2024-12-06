import { useBoolean } from "@force-dev/react";
import { Alert, Collapse, Divider, Modal, Steps } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useState } from "react";

import { AsyncButton, ClientList, ServerList } from "~@components";

import { ServerActions } from "../../components/serverActions";
import { useClientsVM } from "./hooks";

interface IProps {}

export const ClientsPage: FC<PropsWithChildren<IProps>> = observer(() => {
  const {
    serverId,
    onChangeServer,
    servers,
    serversLoading,
    createServer,

    clients,
    clientsLoading,
    updateClient,
    createClient,
    deleteClient,
    deleteServer,
  } = useClientsVM();

  const warnMessage =
    "Одновременное использование одной точки доступа на двух и более устройствах, приведет к нестабильной работе доступа в интернет.";

  return (
    <div className={"flex pt-1"}>
      <div className={"shadow-2xl rounded-md p-4 flex-grow min-w-0"}>
        <Alert
          description={warnMessage}
          type="warning"
          className={"mb-2"}
          showIcon
          closable
        />

        <ServerList
          serverId={serverId}
          items={servers}
          loading={serversLoading}
          onServerSelect={onChangeServer}
          onCreate={createServer}
          onDelete={deleteServer}
        />
        <ServerActions serverId={serverId} />
        <ClientList
          serverId={serverId}
          data={clients}
          loading={clientsLoading}
          onDelete={deleteClient}
          onUpdate={updateClient}
          onCreate={createClient}
        />
      </div>
    </div>
  );
});
