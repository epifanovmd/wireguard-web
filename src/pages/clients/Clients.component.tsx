import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useEffect, useRef } from "react";

import { ClientList } from "../../components";
import { iocContainer } from "../../modules";
import { ClientsProps } from "./Clients.types";
import { ClientListVM } from "./Clients.vm";

interface IProps extends ClientsProps {}

export const ClientsComponent: FC<PropsWithChildren<IProps>> = observer(() => {
  const { list, refresh } = useRef(
    iocContainer.get<ClientListVM>(ClientListVM),
  ).current;

  useEffect(() => {
    refresh().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ClientList data={list} />;
});
