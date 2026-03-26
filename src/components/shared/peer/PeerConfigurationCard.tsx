import { PeerModel } from "@models";
import { memo } from "react";

import { AsyncButton, Card, CardProps, CopyableText } from "../../ui";

export interface IPeerConfigurationCardProps extends CardProps {
  peer: PeerModel;
  canManage?: boolean;
  handleRotatePsk?: () => void;
  handleRemovePsk?: () => void;
}

export const PeerConfigurationCard = memo<IPeerConfigurationCardProps>(
  ({ peer, canManage = false, handleRotatePsk, handleRemovePsk }) => {
    return (
      <Card title="Конфигурация пира">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {[
            ["Разрешённые IP (сервер)", peer.data.allowedIPs],
            ["Разрешённые IP (клиент)", peer.data.clientAllowedIPs],
            ["Keepalive, сек", peer.data.persistentKeepalive ?? "—"],
            ["DNS", peer.data.dns ?? "—"],
            ["MTU", peer.data.mtu ? String(peer.data.mtu) : "—"],
            ["PSK", peer.data.hasPresharedKey ? "Да" : "Нет"],
            ["Истекает", peer.expiresAtDate.formatted ?? "Никогда"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="font-medium text-foreground mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Публичный ключ</p>
          <CopyableText
            text={peer.data.publicKey}
            className="text-muted-foreground"
          />
        </div>
        {canManage && peer.data.hasPresharedKey && (
          <div className="mt-4 flex gap-2">
            <AsyncButton size="sm" variant="outline" onClick={handleRotatePsk}>
              Обновить PSK
            </AsyncButton>
            <AsyncButton size="sm" variant="ghost" onClick={handleRemovePsk}>
              Удалить PSK
            </AsyncButton>
          </div>
        )}
      </Card>
    );
  },
);
