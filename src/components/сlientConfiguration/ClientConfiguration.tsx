import { QRCode, Spin } from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, PropsWithChildren, useCallback, useEffect } from "react";

import { IWgClientsDto } from "~@api/api-gen/data-contracts";
import { downloadBlob } from "~@common";
import { useClientConfigurationDataStore } from "~@store";

import { Button } from "../ui";

export interface IClientConfigurationProps {
  client: IWgClientsDto;
  onError?: () => void;
}

export const ClientConfiguration: FC<
  PropsWithChildren<IClientConfigurationProps>
> = observer(({ client, onError }) => {
  const { onRefresh, data } = useClientConfigurationDataStore();

  useEffect(() => {
    onRefresh(client.id!).then(res => {
      if (!res) {
        onError?.();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = useCallback(
    (value: string) => {
      downloadBlob(new Blob([value]), `${client.name}.conf`);
    },
    [client.name],
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
});
