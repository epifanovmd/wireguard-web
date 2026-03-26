import { badgeVariants, cn } from "@components/ui";
import { User, UserPlus, X } from "lucide-react";
import { FC } from "react";

interface PeerUserBadgeProps {
  displayName?: string | null;
  canManage?: boolean;
  onAssign?: () => void;
  onRevoke?: () => void;
}

export const PeerUserBadge: FC<PeerUserBadgeProps> = ({
  displayName,
  canManage,
  onAssign,
  onRevoke,
}) => {
  if (displayName) {
    return (
      <div
        className={cn(
          badgeVariants({ variant: "purple" }),
          "gap-1 select-none",
          { "cursor-pointer": canManage },
        )}
        onClick={canManage ? onAssign : undefined}
      >
        <User size={10} className="flex-shrink-0" />
        <span className="max-w-[120px] truncate min-w-0">{displayName}</span>
        {canManage && (
          <span
            className="flex-shrink-0 rounded-full bg-current/20 hover:bg-current/40 transition-colors p-0.5 cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              onRevoke?.();
            }}
          >
            <X size={10} />
          </span>
        )}
      </div>
    );
  }

  if (!canManage) return null;

  return (
    <div
      className={cn(
        badgeVariants({ variant: "outline" }),
        "gap-1 cursor-pointer hover:bg-accent",
      )}
      onClick={onAssign}
    >
      <UserPlus size={10} className="flex-shrink-0" />
      Назначить
    </div>
  );
};
