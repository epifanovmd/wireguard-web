import { ClientList } from "@components";
import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren } from "react";

import { useClientsVM } from "./hooks";

interface IProps {}

export const Clients: FC<PropsWithChildren<IProps>> = observer(() => {
  const { list } = useClientsVM();

  return <ClientList data={list} />;
});
