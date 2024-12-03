import { QRCode, Spin } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useCallback, useEffect } from "react";

import { downloadBlob } from "~@common";
import { useClientConfigurationDataStore } from "~@store";

import { Button } from "../ui";

export interface IClientConfigurationProps {
  clientId: string;
}

const _ClientConfiguration: FC<
  PropsWithChildren<IClientConfigurationProps>
> = ({ clientId }) => {
  const { onRefresh, data } = useClientConfigurationDataStore();

  useEffect(() => {
    onRefresh(clientId).then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = useCallback(
    (value: string) => {
      downloadBlob(new Blob([value]), `${clientId}.conf`);
    },
    [clientId],
  );

  return (
    <div
      className={"flex flex-col items-center justify-center h-[334px] w-full"}
    >
      {data ? <QRCode size={300} value={data} /> : <Spin size={"large"} />}
      {!!data && (
        <Button
          type={"primary"}
          className={"mt-2"}
          onClick={() => {
            handleDownload(data);
          }}
        >
          {"Скачать файл конфигурации"}
        </Button>
      )}
    </div>
  );
};

export const ClientConfiguration = observer(_ClientConfiguration);
