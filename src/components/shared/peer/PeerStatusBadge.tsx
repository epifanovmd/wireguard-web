import { FC } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";

import { Badge } from "../../ui";

const STATUS_CONFIG: Record<string, { variant: any; label: string }> = {
  [EWgServerStatus.Up]: { variant: "success", label: "Работает" },
  [EWgServerStatus.Down]: { variant: "gray", label: "Не работает" },
  [EWgServerStatus.Error]: { variant: "danger", label: "Ошибка" },
  [EWgServerStatus.Unknown]: { variant: "default", label: "Неизвестно" },
};

export const PeerStatusBadge: FC<{ status: EWgServerStatus }> = ({
  status,
}) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[EWgServerStatus.Unknown];
  return (
    <Badge variant={cfg.variant} dot>
      {cfg.label}
    </Badge>
  );
};
