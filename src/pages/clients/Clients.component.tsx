import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useEffect, useRef } from "react";

import { ClientList } from "../../components";
import { ClientsProps, IClientListVM } from "./Clients.types";

interface IProps extends ClientsProps {}

export const ClientsComponent: FC<PropsWithChildren<IProps>> = observer(() => {
  const { list, refresh } = useRef(IClientListVM.getInstance()).current;

  useEffect(() => {
    refresh().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ClientList data={list} />;
});
