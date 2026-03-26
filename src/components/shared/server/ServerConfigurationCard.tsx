import { WgServerDto } from "@api/api-gen/data-contracts";
import { memo } from "react";

import { Card, CardProps, CopyableText } from "../../ui";

export interface IServerConfigurationCardProps extends CardProps {
  server?: WgServerDto;
}

export const ServerConfigurationCard = memo<IServerConfigurationCardProps>(
  ({ server, ...props }) => {
    return (
      <Card {...props}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {[
            ["Интерфейс", server?.interface],
            ["Порт", String(server?.listenPort)],
            ["Адрес", server?.address],
            ["Эндпоинт", server?.endpoint ?? "—"],
            ["DNS", server?.dns ?? "—"],
            ["MTU", server?.mtu ? String(server.mtu) : "—"],
            ["Статус", server?.status],
            ["Включён", server?.enabled ? "Да" : "Нет"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="font-medium text-foreground mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
        {server?.publicKey && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Публичный ключ</p>
            <CopyableText
              className="text-muted-foreground"
              text={server.publicKey}
            />
          </div>
        )}
      </Card>
    );
  },
);
