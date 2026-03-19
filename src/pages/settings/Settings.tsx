import { Check, Fingerprint, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { useApi } from "~@api";
import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { usePasskeyAuth } from "~@common";
import { PageHeader } from "~@components/layouts";
import {
  AsyncButton,
  Badge,
  Button,
  Card,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from "~@components/ui2";
import { useAuthStore } from "~@store";
import { useTheme } from "~@theme";

export const Settings: FC = observer(() => {
  const toast = useToast();
  const { isDark, setTheme } = useTheme();
  const [health, setHealth] = useState<{
    uptime: number;
    dbStatus: string;
    version: string;
  } | null>(null);

  const api = useApi();
  const { user } = useAuthStore();
  const profile = user?.profile;
  const passkey = usePasskeyAuth();

  useEffect(() => {
    fetch("/health")
      .then(r => r.json())
      .then(data => setHealth(data))
      .catch(() => {});
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

  const handlePasskeyRegister = async () => {
    if (!profile?.id) return;

    const userRes = await api.getUserById(profile.userId);
    const login = userRes.data?.email ?? userRes.data?.phone;

    if (!login) {
      toast.error("Не удалось определить логин (email/телефон)");
      return;
    }

    const ok = await passkey.handleRegister(login);

    if (ok) {
      toast.success("Passkey успешно зарегистрирован");
    } else if (passkey.error) {
      toast.error(passkey.error);
    }
  };

  const handlePasskeyRemove = () => {
    passkey.removePasskey();
    toast.success("Passkey удалён с этого устройства");
  };

  const PERMISSIONS_MATRIX = [
    { permission: EPermissions.Read, admin: true, user: true, guest: true },
    { permission: EPermissions.Write, admin: true, user: false, guest: false },
    { permission: EPermissions.Delete, admin: true, user: false, guest: false },
    {
      permission: EPermissions.WgServerView,
      admin: true,
      user: false,
      guest: false,
    },
    {
      permission: EPermissions.WgServerManage,
      admin: true,
      user: false,
      guest: false,
    },
    {
      permission: EPermissions.WgServerControl,
      admin: true,
      user: false,
      guest: false,
    },
    {
      permission: EPermissions.WgPeerView,
      admin: true,
      user: true,
      guest: false,
    },
    {
      permission: EPermissions.WgPeerManage,
      admin: true,
      user: false,
      guest: false,
    },
    {
      permission: EPermissions.WgPeerOwn,
      admin: true,
      user: true,
      guest: false,
    },
    {
      permission: EPermissions.WgStatsView,
      admin: true,
      user: true,
      guest: false,
    },
    {
      permission: EPermissions.WgStatsExport,
      admin: true,
      user: false,
      guest: false,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Настройки"
        subtitle="Системная конфигурация и информация"
      />
      <div className="p-4 sm:p-6 overflow-auto">
        <Tabs defaultValue="system">
          <TabsList>
            <TabsTrigger value="system">Система</TabsTrigger>
            <TabsTrigger value="security">Безопасность</TabsTrigger>
            <TabsTrigger value="roles">Роли и права</TabsTrigger>
          </TabsList>

          <TabsContent value="system">
            <div className="flex flex-col gap-6 max-w-2xl mt-4">
              {/* Theme */}
              <Card title="Внешний вид" className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      Тёмная тема
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Переключение между светлой и тёмной темой
                    </p>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={v => setTheme(v ? "dark" : "light")}
                  />
                </div>
              </Card>

              {/* Health */}
              <Card title="Состояние системы" className="p-5">
                {health ? (
                  <dl className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-[var(--muted-foreground)]">
                        База данных
                      </dt>
                      <dd>
                        <Badge
                          variant={
                            health.dbStatus === "ok" ? "success" : "danger"
                          }
                          dot
                        >
                          {health.dbStatus ?? "unknown"}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-[var(--muted-foreground)]">
                        Аптайм
                      </dt>
                      <dd className="text-sm text-[var(--foreground)] font-medium">
                        {formatUptime(health.uptime ?? 0)}
                      </dd>
                    </div>
                    {health.version && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-[var(--muted-foreground)]">
                          Версия
                        </dt>
                        <dd className="text-sm text-[var(--foreground)] font-mono">
                          {health.version}
                        </dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Загрузка данных...
                  </p>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="flex flex-col gap-6 max-w-2xl mt-4">
              <Card title="Passkey (биометрический вход)" className="p-5">
                {!passkey.support ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Ваш браузер не поддерживает passkey (WebAuthn).
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
                        <Fingerprint
                          size={16}
                          className="text-[var(--muted-foreground)]"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {passkey.profileId
                            ? "Passkey зарегистрирован на этом устройстве"
                            : "Passkey не зарегистрирован на этом устройстве"}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                          {passkey.profileId
                            ? `Логин: ${passkey.profileId}`
                            : "Зарегистрируйте passkey для входа через Face ID, Touch ID или ключ безопасности."}
                        </p>
                      </div>
                      <Badge
                        variant={passkey.profileId ? "success" : "gray"}
                        dot
                      >
                        {passkey.profileId ? "Активен" : "Не задан"}
                      </Badge>
                    </div>

                    {passkey.error && (
                      <div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-xs text-destructive">
                          {passkey.error}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <AsyncButton
                        size="sm"
                        variant={passkey.profileId ? "outline" : "default"}
                        loading={passkey.loading}
                        onClick={handlePasskeyRegister}
                      >
                        {passkey.profileId
                          ? "Перерегистрировать passkey"
                          : "Зарегистрировать passkey"}
                      </AsyncButton>
                      {passkey.profileId && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handlePasskeyRemove}
                        >
                          Удалить
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="flex flex-col gap-6 max-w-3xl mt-4">
              <Card title="Матрица прав" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                          Право
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-purple-500 uppercase tracking-wider">
                          Админ
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-blue-500 uppercase tracking-wider">
                          Пользователь
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                          Гость
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PERMISSIONS_MATRIX.map(row => (
                        <tr
                          key={row.permission}
                          className="border-b border-[var(--border)] hover:bg-[var(--accent)]"
                        >
                          <td className="px-4 py-2.5 font-mono text-xs text-[var(--muted-foreground)]">
                            {row.permission}
                          </td>
                          {[row.admin, row.user, row.guest].map((has, i) => (
                            <td key={i} className="px-4 py-2.5 text-center">
                              {has ? (
                                <Check
                                  size={16}
                                  className="inline text-success"
                                  strokeWidth={2.5}
                                />
                              ) : (
                                <X
                                  size={16}
                                  className="inline text-[var(--muted-foreground)] opacity-30"
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card title="Доступные роли" className="p-5">
                <div className="flex gap-3 flex-wrap">
                  {[
                    {
                      role: ERole.Admin,
                      desc: "Полный доступ ко всем функциям",
                      variant: "purple" as const,
                    },
                    {
                      role: ERole.User,
                      desc: "Стандартный доступ пользователя",
                      variant: "info" as const,
                    },
                    {
                      role: ERole.Guest,
                      desc: "Минимальный доступ только для чтения",
                      variant: "gray" as const,
                    },
                  ].map(r => (
                    <div
                      key={r.role}
                      className="flex-1 min-w-[160px] bg-[var(--muted)] rounded-lg p-3"
                    >
                      <Badge variant={r.variant}>{r.role}</Badge>
                      <p className="text-xs text-[var(--muted-foreground)] mt-2">
                        {r.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
});
