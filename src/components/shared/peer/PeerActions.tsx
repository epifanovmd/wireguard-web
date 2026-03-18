import { type VariantProps } from "class-variance-authority";
import { Pencil, Power, QrCode, Trash2 } from "lucide-react";
import { FC } from "react";

import { AsyncIconButton, iconButtonVariants } from "../../ui2";

interface PeerActionsProps
  extends Pick<VariantProps<typeof iconButtonVariants>, "size"> {
  enabled: boolean;
  onQr?: () => void;
  onToggle: () => Promise<void>;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export const PeerActions: FC<PeerActionsProps> = ({
  enabled,
  size,
  onQr,
  onToggle,
  onEdit,
  onDelete,
}) => (
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
      title={enabled ? "Отключить" : "Включить"}
      size={size}
      variant={enabled ? "disable" : "enable"}
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
