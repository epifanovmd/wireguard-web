import { Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { useApi } from "~@api/hooks";
import { Badge, Button, Card, Input, PageHeader, Tabs, Toggle, useToast } from "~@components";
import { useProfileDataStore, useSessionDataStore } from "~@store";
import { useTheme } from "~@theme";

export const Settings: FC = observer(() => {
  const profileStore = useProfileDataStore();
  const session = useSessionDataStore();
  const api = useApi();
  const toast = useToast();

  const { isDark, setTheme } = useTheme();
  const [health, setHealth] = useState<{ uptime: number; dbStatus: string; version: string } | null>(null);

  useEffect(() => {
    fetch("/health").then(r => r.json()).then(data => setHealth(data)).catch(() => {});
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${m}m`);
    return parts.join(" ");
  };

  const PERMISSIONS_MATRIX = [
    { permission: EPermissions.Read, admin: true, user: true, guest: true },
    { permission: EPermissions.Write, admin: true, user: false, guest: false },
    { permission: EPermissions.Delete, admin: true, user: false, guest: false },
    { permission: EPermissions.WgServerView, admin: true, user: false, guest: false },
    { permission: EPermissions.WgServerManage, admin: true, user: false, guest: false },
    { permission: EPermissions.WgServerControl, admin: true, user: false, guest: false },
    { permission: EPermissions.WgPeerView, admin: true, user: true, guest: false },
    { permission: EPermissions.WgPeerManage, admin: true, user: false, guest: false },
    { permission: EPermissions.WgPeerOwn, admin: true, user: true, guest: false },
    { permission: EPermissions.WgStatsView, admin: true, user: true, guest: false },
    { permission: EPermissions.WgStatsExport, admin: true, user: false, guest: false },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Settings" subtitle="System configuration and information" />
      <div className="p-6">
        <Tabs items={[
          {
            key: "system",
            label: "System",
            children: (
              <div className="flex flex-col gap-6 max-w-2xl">
                {/* Theme */}
                <Card title="Appearance" padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Dark mode</p>
                      <p className="text-xs text-[var(--text-muted)]">Toggle between light and dark theme</p>
                    </div>
                    <Toggle checked={isDark} onChange={v => setTheme(v ? "dark" : "light")} />
                  </div>
                </Card>

                {/* Health */}
                <Card title="System health" padding="md">
                  {health ? (
                    <dl className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-[var(--text-muted)]">Database</dt>
                        <dd>
                          <Badge variant={health.dbStatus === "ok" ? "success" : "danger"} dot>
                            {health.dbStatus ?? "unknown"}
                          </Badge>
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-[var(--text-muted)]">Uptime</dt>
                        <dd className="text-sm text-[var(--text-primary)] font-medium">{formatUptime(health.uptime ?? 0)}</dd>
                      </div>
                      {health.version && (
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-[var(--text-muted)]">Version</dt>
                          <dd className="text-sm text-[var(--text-primary)] font-mono">{health.version}</dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <p className="text-sm text-[var(--text-muted)]">Loading health data...</p>
                  )}
                </Card>
              </div>
            ),
          },
          {
            key: "roles",
            label: "Roles & Permissions",
            children: (
              <div className="flex flex-col gap-6 max-w-3xl">
                <Card title="Permissions matrix" subtitle="Default permissions per role" padding="none">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--table-header-bg)] border-b border-[var(--border-color)]">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Permission</th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-purple-500 uppercase tracking-wider">Admin</th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-blue-500 uppercase tracking-wider">User</th>
                          <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Guest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PERMISSIONS_MATRIX.map(row => (
                          <tr key={row.permission} className="border-b border-[var(--border-color)] hover:bg-[var(--table-row-hover)]">
                            <td className="px-4 py-2.5 font-mono text-xs text-[var(--text-secondary)]">{row.permission}</td>
                            {[row.admin, row.user, row.guest].map((has, i) => (
                              <td key={i} className="px-4 py-2.5 text-center">
                                {has ? (
                                  <Check size={16} className="inline text-green-500" strokeWidth={2.5} />
                                ) : (
                                  <X size={16} className="inline text-[var(--border-color-2)]" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card title="Available roles" padding="md">
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { role: ERole.Admin, desc: "Full access to all features", variant: "purple" as const },
                      { role: ERole.User, desc: "Standard user access", variant: "info" as const },
                      { role: ERole.Guest, desc: "Read-only minimal access", variant: "gray" as const },
                    ].map(r => (
                      <div key={r.role} className="flex-1 min-w-[160px] bg-[var(--bg-surface-2)] rounded-lg p-3">
                        <Badge variant={r.variant}>{r.role}</Badge>
                        <p className="text-xs text-[var(--text-muted)] mt-2">{r.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ),
          },
        ]} />
      </div>
    </div>
  );
});
