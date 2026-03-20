import { type VariantProps } from "class-variance-authority";
import { Pencil, Power, QrCode, Trash2 } from "lucide-react";
import { FC } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";

import { AsyncIconButton, iconButtonVariants } from "../../ui";

interface PeerActionsProps
  extends Pick<VariantProps<typeof iconButtonVariants>, "size"> {
  status: EWgServerStatus;
  onQr?: () => void;
  onToggle: () => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export const PeerActions: FC<PeerActionsProps> = ({
  status,
  size,
  onQr,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const isRunning = status === EWgServerStatus.Up;

  return (
    <div
      className="flex items-center justify-end gap-0.5"
      onClick={e => e.stopPropagation()}
    >
      {onQr && (
        <AsyncIconButton
          title="QR-код"
          size={size}
          variant="primary"
          onClick={onQr}
        >
          <QrCode size={15} />
        </AsyncIconButton>
      )}
      <AsyncIconButton
        title={isRunning ? "Остановить" : "Запустить"}
        size={size}
        variant={isRunning ? "disable" : "enable"}
        onClick={onToggle}
      >
        <Power size={15} />
      </AsyncIconButton>
      {onEdit && (
        <AsyncIconButton title="Редактировать" size={size} onClick={onEdit}>
          <Pencil size={15} />
        </AsyncIconButton>
      )}
      {onDelete && (
        <AsyncIconButton
          title="Удалить"
          size={size}
          variant="destructive"
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </AsyncIconButton>
      )}
    </div>
  );
};
