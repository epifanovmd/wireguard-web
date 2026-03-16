import React, { FC } from "react";

import { EPermissions } from "~@api/api-gen/data-contracts";
import { Checkbox } from "~@components";

const PERMISSION_GROUPS = [
  {
    label: "General",
    items: [
      { value: EPermissions.Read, label: "Read", description: "View data" },
      { value: EPermissions.Write, label: "Write", description: "Create and edit records" },
      { value: EPermissions.Delete, label: "Delete", description: "Delete records" },
    ],
  },
  {
    label: "WireGuard Servers",
    items: [
      { value: EPermissions.WgServerView, label: "View servers", description: "List and view server details" },
      { value: EPermissions.WgServerManage, label: "Manage servers", description: "Create, edit, delete servers" },
      { value: EPermissions.WgServerControl, label: "Control servers", description: "Start, stop, restart servers" },
    ],
  },
  {
    label: "WireGuard Peers",
    items: [
      { value: EPermissions.WgPeerView, label: "View peers", description: "List and view peer details" },
      { value: EPermissions.WgPeerManage, label: "Manage peers", description: "Create, edit, delete peers" },
      { value: EPermissions.WgPeerOwn, label: "Own peers only", description: "Access only own assigned peers" },
    ],
  },
  {
    label: "Statistics",
    items: [
      { value: EPermissions.WgStatsView, label: "View statistics", description: "View traffic and speed data" },
      { value: EPermissions.WgStatsExport, label: "Export statistics", description: "Download and export stats" },
    ],
  },
];

interface PermissionsEditorProps {
  value: EPermissions[];
  onChange: (perms: EPermissions[]) => void;
}

export const PermissionsEditor: FC<PermissionsEditorProps> = ({ value, onChange }) => {
  const toggle = (perm: EPermissions) => {
    if (value.includes(perm)) {
      onChange(value.filter(p => p !== perm));
    } else {
      onChange([...value, perm]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {PERMISSION_GROUPS.map(group => (
        <div key={group.label}>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">{group.label}</p>
          <div className="flex flex-col gap-2 pl-1">
            {group.items.map(item => (
              <Checkbox
                key={item.value}
                label={item.label}
                description={item.description}
                checked={value.includes(item.value)}
                onChange={() => toggle(item.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
