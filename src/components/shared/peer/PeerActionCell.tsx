import { Power, QrCode, Trash2 } from "lucide-react";
import { FC } from "react";

import { PeerModel } from "~@models";

import { IconButton } from "../../ui2";

export interface PeerActionsCellProps {
  peer: PeerModel;
  loading: string | undefined;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string, name: string) => void;
  onQr: (id: string, name: string) => void;
}

export const PeerActionsCell: FC<PeerActionsCellProps> = ({
  peer,
  loading,
  onToggle,
  onDelete,
  onQr,
}) => (
  <div
    className="flex items-center justify-end gap-0.5"
    onClick={e => e.stopPropagation()}
  >
    <IconButton
      title="QR Code"
      className="cursor-pointer p-1.5 rounded-md hover:bg-[var(--accent)] text-[var(--muted-foreground)] hover:text-[#6366f1] transition-colors"
      onClick={() => onQr(peer.data.id, peer.name)}
    >
      <QrCode size={15} />
    </IconButton>
    <IconButton
      title={peer.enabled ? "Disable" : "Enable"}
      className={`cursor-pointer p-1.5 rounded-md transition-colors ${
        peer.enabled
          ? "text-[var(--muted-foreground)] hover:bg-warning/10 hover:text-warning"
          : "text-[var(--muted-foreground)] hover:bg-success/10 hover:text-success"
      }`}
      onClick={() => onToggle(peer.data.id, peer.enabled)}
      disabled={loading === "toggle"}
    >
      <Power size={15} />
    </IconButton>
    <IconButton
      title="Delete"
      disabled={loading === "delete"}
      onClick={() => onDelete(peer.data.id, peer.name)}
    >
      <Trash2 size={15} />
    </IconButton>
  </div>
);
