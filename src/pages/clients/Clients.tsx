import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren } from "react";

import { ClientList } from "~@components";

import { useClientsVM } from "./hooks";

interface IProps {}

export const ClientsPage: FC<PropsWithChildren<IProps>> = observer(() => {
  const { list, loading } = useClientsVM();

  return <ClientList data={list} loading={loading} />;
});
