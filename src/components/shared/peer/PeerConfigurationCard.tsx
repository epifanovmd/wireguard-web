import { memo } from "react";

import { PeerModel } from "~@models";

import { AsyncButton, Card, CardProps, CopyableText } from "../../ui2";

export interface IPeerConfigurationCardProps extends CardProps {
  peer: PeerModel;
  handleRotatePsk?: () => void;
  handleRemovePsk?: () => void;
}

export const PeerConfigurationCard = memo<IPeerConfigurationCardProps>(
  ({ peer, handleRotatePsk, handleRemovePsk }) => {
    return (
      <Card title="Конфигурация пира">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {[
            ["Разрешённые IP", peer.data.allowedIPs],
            ["IP клиента", peer.data.clientAllowedIPs],
            ["Эндпоинт", peer.data.endpoint ?? "—"],
            [
              "Keepalive",
              peer.data.persistentKeepalive
                ? `${peer.data.persistentKeepalive}с`
                : "—",
            ],
            ["DNS", peer.data.dns ?? "—"],
            ["MTU", peer.data.mtu ? String(peer.data.mtu) : "—"],
            ["PSK", peer.data.hasPresharedKey ? "Да" : "Нет"],
            ["Истекает", peer.expiresAt ?? "Никогда"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-[var(--muted-foreground)]">{k}</dt>
              <dd className="font-medium text-[var(--foreground)] mt-0.5">
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">
            Публичный ключ
          </p>
          <CopyableText
            text={peer.data.publicKey}
            truncate={false}
            className="text-[var(--muted-foreground)]"
          />
        </div>
        {peer.data.hasPresharedKey && (
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
