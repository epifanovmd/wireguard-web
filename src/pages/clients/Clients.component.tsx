import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useEffect } from "react";

import { ClientList } from "../../components";
import { ClientsProps } from "./Clients.types";
import { useClientsVM } from "./useClientsVM";

interface IProps extends ClientsProps {}

export const ClientsComponent: FC<PropsWithChildren<IProps>> = observer(() => {
  const { list, refresh } = useClientsVM();

  useEffect(() => {
    refresh().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ClientList data={list} />;
});
