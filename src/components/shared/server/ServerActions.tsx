import { type VariantProps } from "class-variance-authority";
import { Pencil, Play, RotateCcw, Square, Trash2 } from "lucide-react";
import { FC } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";

import { AsyncIconButton, iconButtonVariants } from "../../ui";

interface ServerActionsProps
  extends Pick<VariantProps<typeof iconButtonVariants>, "size"> {
  status?: EWgServerStatus;
  canManage?: boolean;
  canControl?: boolean;
  onEdit?: () => void;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  onRestart: () => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const ServerActions: FC<ServerActionsProps> = ({
  status,
  size,
  canManage = false,
  canControl = false,
  onEdit,
  onStart,
  onStop,
  onRestart,
  onDelete,
}) => {
  const isDown =
    status === EWgServerStatus.Down || status === EWgServerStatus.Error;

  return (
    <div
      className="flex items-center justify-end gap-0.5"
      onClick={e => e.stopPropagation()}
    >
      {canManage && onEdit && (
        <AsyncIconButton title="Редактировать" size={size} onClick={onEdit}>
          <Pencil size={15} />
        </AsyncIconButton>
      )}
      {canControl && (
        <>
          {isDown ? (
            <AsyncIconButton title="Запустить" size={size} onClick={onStart}>
              <Play size={15} className="text-success" />
            </AsyncIconButton>
          ) : (
            <AsyncIconButton title="Остановить" size={size} onClick={onStop}>
              <Square size={15} className="text-warning" />
            </AsyncIconButton>
          )}
          <AsyncIconButton
            title="Перезапустить"
            size={size}
            onClick={onRestart}
          >
            <RotateCcw size={15} />
          </AsyncIconButton>
        </>
      )}
      {canManage && onDelete && (
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
