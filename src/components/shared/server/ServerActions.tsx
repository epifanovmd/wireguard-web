import { type VariantProps } from "class-variance-authority";
import { Pencil, Play, RotateCcw, Square, Trash2 } from "lucide-react";
import { FC } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";

import { AsyncIconButton, iconButtonVariants } from "../../ui2";

interface ServerActionsProps
  extends Pick<VariantProps<typeof iconButtonVariants>, "size"> {
  status?: EWgServerStatus;
  onEdit?: () => void;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  onRestart: () => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const ServerActions: FC<ServerActionsProps> = ({
  status,
  size,
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
      {onEdit && (
        <AsyncIconButton title="Edit" size={size} onClick={onEdit}>
          <Pencil size={15} />
        </AsyncIconButton>
      )}
      {isDown ? (
        <AsyncIconButton title="Start" size={size} onClick={onStart}>
          <Play size={15} className="text-success" />
        </AsyncIconButton>
      ) : (
        <AsyncIconButton title="Stop" size={size} onClick={onStop}>
          <Square size={15} className="text-warning" />
        </AsyncIconButton>
      )}
      <AsyncIconButton title="Restart" size={size} onClick={onRestart}>
        <RotateCcw size={15} />
      </AsyncIconButton>
      {onDelete && (
        <AsyncIconButton
          title="Delete"
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
