import { Check, Fingerprint, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

import { useApi } from "~@api";
import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { usePasskeyAuth } from "~@common";
import { PageHeader, PageLayout } from "~@components/layouts";
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
} from "~@components/ui";
import { useNotification } from "~@core/notifications";
import { useAuthStore, usePermissions } from "~@store";
import { useTheme } from "~@theme";

// ─── Статические метаданные разрешений ──────────────────────────────────────

interface PermissionMeta {
  label: string;
  description: string;
  group: string;
}

const PERMISSION_META: Record<EPermissions, PermissionMeta> = {
  [EPermissions.Value]: {
    label: "Суперправо *",
    description: "Полный доступ ко всему",
    group: "Суперправа",
  },
  [EPermissions.Wg]: {
    label: "wg:*",
    description: "Все WireGuard-права",
    group: "Wildcards",
  },
  [EPermissions.WgServer]: {
    label: "wg:server:*",
    description: "Все права на серверы",
    group: "Wildcards",
  },
  [EPermissions.WgPeer]: {
    label: "wg:peer:*",
    description: "Все права на пиры",
    group: "Wildcards",
  },
  [EPermissions.WgStats]: {
    label: "wg:stats:*",
    description: "Все права на статистику",
    group: "Wildcards",
  },
  [EPermissions.WgServerView]: {
    label: "wg:server:view",
    description: "Просмотр серверов",
    group: "Серверы WireGuard",
  },
  [EPermissions.WgServerManage]: {
    label: "wg:server:manage",
    description: "Управление серверами (create/edit/delete)",
    group: "Серверы WireGuard",
  },
  [EPermissions.WgServerControl]: {
    label: "wg:server:control",
    description: "Контроль серверов (start/stop/restart)",
    group: "Серверы WireGuard",
  },
  [EPermissions.WgPeerView]: {
    label: "wg:peer:view",
    description: "Просмотр всех пиров",
    group: "Пиры WireGuard",
  },
  [EPermissions.WgPeerManage]: {
    label: "wg:peer:manage",
    description: "Управление пирами (create/edit/delete)",
    group: "Пиры WireGuard",
  },
  [EPermissions.WgPeerOwn]: {
    label: "wg:peer:own",
    description: "Только свои пиры",
    group: "Пиры WireGuard",
  },
  [EPermissions.WgStatsView]: {
    label: "wg:stats:view",
    description: "Просмотр статистики",
    group: "Статистика",
  },
  [EPermissions.WgStatsExport]: {
    label: "wg:stats:export",
    description: "Экспорт статистики",
    group: "Статистика",
  },
  [EPermissions.UserView]: {
    label: "user:view",
    description: "Просмотр пользователей",
    group: "Пользователи",
  },
  [EPermissions.UserManage]: {
    label: "user:manage",
    description: "Управление пользователями и правами",
    group: "Пользователи",
  },
  [EPermissions.Read]: {
    label: "read",
    description: "Чтение данных",
    group: "Общие",
  },
  [EPermissions.Write]: {
    label: "write",
    description: "Создание и редактирование",
    group: "Общие",
  },
  [EPermissions.Delete]: {
    label: "delete",
    description: "Удаление данных",
    group: "Общие",
  },
};

// ─── Матрица прав по умолчанию для ролей ────────────────────────────────────
// Источник истины: бэкенд (admin.bootstrap.ts), здесь — для отображения

const ROLE_DEFAULT_PERMISSIONS: Record<ERole, EPermissions[]> = {
  [ERole.Admin]: [EPermissions.Value], // superadmin bypass
  [ERole.User]: [
    EPermissions.Read,
    EPermissions.WgPeerView,
    EPermissions.WgPeerOwn,
    EPermissions.WgStatsView,
  ],
  [ERole.Guest]: [EPermissions.Read],
};

// Права, которые показываем в матрице (исключаем wildcards — они суммарные)
const MATRIX_PERMISSIONS: EPermissions[] = [
  EPermissions.WgServerView,
  EPermissions.WgServerManage,
  EPermissions.WgServerControl,
  EPermissions.WgPeerView,
  EPermissions.WgPeerManage,
  EPermissions.WgPeerOwn,
  EPermissions.WgStatsView,
  EPermissions.WgStatsExport,
  EPermissions.UserView,
  EPermissions.UserManage,
  EPermissions.Read,
  EPermissions.Write,
  EPermissions.Delete,
];

// ─── Компонент ──────────────────────────────────────────────────────────────

export const Settings: FC = observer(() => {
  const toast = useNotification();
  const { isDark, setTheme } = useTheme();
  const [health, setHealth] = useState<{
    uptime: number;
    dbStatus: string;
    version: string;
  } | null>(null);

  const api = useApi();
  const { user } = useAuthStore();
  const { isAdmin, permissions, directPermissions, roles } = usePermissions();
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

    const { ok, error } = await passkey.handleRegister(login);

    if (ok) {
      toast.success("Passkey успешно зарегистрирован");
    } else if (error) {
      toast.error(error);
    }
  };

  const handlePasskeyRemove = () => {
    passkey.removePasskey();
  };

  // Есть ли право у роли (с учётом admin bypass)
  const roleHas = (role: ERole, perm: EPermissions): boolean => {
    if (role === ERole.Admin) return true; // admin bypass
    const rolePerms = ROLE_DEFAULT_PERMISSIONS[role];

    return rolePerms.includes(EPermissions.Value) || rolePerms.includes(perm);
  };

  // Группировка прав пользователя по источнику
  const rolePermissions = user?.roles.flatMap(r =>
    r.permissions.map(p => p.name as EPermissions),
  ) ?? [];

  const myPermGroups = Object.entries(
    MATRIX_PERMISSIONS.reduce<Record<string, EPermissions[]>>((acc, perm) => {
      const group = PERMISSION_META[perm]?.group ?? "Прочее";

      (acc[group] ??= []).push(perm);
      return acc;
    }, {}),
  );

  return (
    <PageLayout
      header={
        <PageHeader
          title="Настройки"
          subtitle="Системная конфигурация и информация"
        />
      }
    >
        <Tabs defaultValue="system">
          <TabsList>
            <TabsTrigger value="system">Система</TabsTrigger>
            <TabsTrigger value="security">Безопасность</TabsTrigger>
            <TabsTrigger value="roles">Роли и права</TabsTrigger>
            <TabsTrigger value="my-permissions">Мои права</TabsTrigger>
          </TabsList>

          {/* ── Система ─────────────────────────────────────────────────── */}
          <TabsContent value="system">
            <div className="flex flex-col gap-6 max-w-2xl mt-4">
              <Card title="Внешний вид" className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Тёмная тема
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Переключение между светлой и тёмной темой
                    </p>
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={v => setTheme(v ? "dark" : "light")}
                  />
                </div>
              </Card>

              <Card title="Состояние системы" className="p-5">
                {health ? (
                  <dl className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-muted-foreground">
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
                      <dt className="text-sm text-muted-foreground">
                        Аптайм
                      </dt>
                      <dd className="text-sm text-foreground font-medium">
                        {formatUptime(health.uptime ?? 0)}
                      </dd>
                    </div>
                    {health.version && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-muted-foreground">
                          Версия
                        </dt>
                        <dd className="text-sm text-foreground font-mono">
                          {health.version}
                        </dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Загрузка данных...
                  </p>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* ── Безопасность ─────────────────────────────────────────────── */}
          <TabsContent value="security">
            <div className="flex flex-col gap-6 max-w-2xl mt-4">
              <Card title="Passkey (биометрический вход)" className="p-5">
                {!passkey.support ? (
                  <p className="text-sm text-muted-foreground">
                    Ваш браузер не поддерживает passkey (WebAuthn).
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Fingerprint
                          size={16}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {passkey.profileId
                            ? "Passkey зарегистрирован на этом устройстве"
                            : "Passkey не зарегистрирован на этом устройстве"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
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

          {/* ── Роли и права ─────────────────────────────────────────────── */}
          <TabsContent value="roles">
            <div className="flex flex-col gap-6 max-w-4xl mt-4">
              {/* Описание ролей */}
              <Card title="Роли" className="p-5">
                <div className="flex gap-3 flex-wrap">
                  {[
                    {
                      role: ERole.Admin,
                      desc: "Полный доступ ко всем функциям. Superadmin bypass — все проверки прав пропускаются.",
                      variant: "purple" as const,
                    },
                    {
                      role: ERole.User,
                      desc: "Стандартный доступ: просмотр пиров, статистики, только свои пиры.",
                      variant: "info" as const,
                    },
                    {
                      role: ERole.Guest,
                      desc: "Минимальный доступ — только чтение общих данных.",
                      variant: "gray" as const,
                    },
                  ].map(r => (
                    <div
                      key={r.role}
                      className="flex-1 min-w-[180px] bg-muted rounded-lg p-3"
                    >
                      <Badge variant={r.variant}>{r.role}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        {r.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Матрица прав по умолчанию */}
              <Card title="Матрица прав по умолчанию" className="overflow-hidden">
                <p className="text-xs text-muted-foreground px-4 pt-3 pb-2">
                  Права назначаются ролям по умолчанию. Администратор обходит все проверки. Пользователям можно добавить дополнительные права напрямую (на странице пользователя).
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-1/2">
                          Право
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-purple-500 uppercase tracking-wider">
                          Admin
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-blue-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Guest
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MATRIX_PERMISSIONS.map(perm => {
                        const meta = PERMISSION_META[perm];
                        const group = meta?.group;

                        return (
                          <tr
                            key={perm}
                            className="border-b border-border hover:bg-accent"
                          >
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                  {perm}
                                </code>
                                {group && (
                                  <span className="text-[10px] text-muted-foreground">
                                    {group}
                                  </span>
                                )}
                              </div>
                              {meta?.description && (
                                <p className="text-[11px] text-muted-foreground mt-0.5 pl-0.5">
                                  {meta.description}
                                </p>
                              )}
                            </td>
                            {[ERole.Admin, ERole.User, ERole.Guest].map(role => (
                              <td key={role} className="px-4 py-2.5 text-center">
                                {roleHas(role, perm) ? (
                                  <Check
                                    size={16}
                                    className="inline text-success"
                                    strokeWidth={2.5}
                                  />
                                ) : (
                                  <X
                                    size={16}
                                    className="inline text-muted-foreground opacity-30"
                                  />
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ── Мои права ────────────────────────────────────────────────── */}
          <TabsContent value="my-permissions">
            <div className="flex flex-col gap-6 max-w-3xl mt-4">
              {/* Текущий пользователь */}
              <Card title="Текущий аккаунт" className="p-5">
                <dl className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd className="text-sm font-medium">{user?.email ?? "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-muted-foreground">Роли</dt>
                    <dd className="flex gap-1.5 flex-wrap justify-end">
                      {roles.length > 0 ? (
                        roles.map(role => (
                          <Badge
                            key={role}
                            variant={
                              role === ERole.Admin
                                ? "purple"
                                : role === ERole.User
                                  ? "info"
                                  : "gray"
                            }
                          >
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Нет ролей
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-muted-foreground">
                      Статус доступа
                    </dt>
                    <dd>
                      <Badge variant={isAdmin ? "purple" : "success"} dot>
                        {isAdmin ? "Суперадмин" : "Ограниченный"}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </Card>

              {/* Прямые права */}
              {directPermissions.length > 0 && (
                <Card title="Прямые права (дополнительные)" className="p-5">
                  <p className="text-xs text-muted-foreground mb-3">
                    Назначены этому аккаунту напрямую, дополнительно к правам роли.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {directPermissions.map(perm => (
                      <div
                        key={perm}
                        className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-md border border-primary/20"
                      >
                        <code className="text-xs text-primary">{perm}</code>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Effective permissions по группам */}
              <Card title="Эффективные права" className="overflow-hidden">
                <p className="text-xs text-muted-foreground px-4 pt-3 pb-2">
                  {isAdmin
                    ? "Администратор — доступ ко всему без ограничений."
                    : "Итоговые права = права роли + прямые права. Wildcards покрывают все дочерние права."}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {myPermGroups.map(([group, perms]) => (
                        <>
                          <tr key={`group-${group}`} className="bg-muted/50">
                            <td
                              colSpan={3}
                              className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                            >
                              {group}
                            </td>
                          </tr>
                          {perms.map(perm => {
                            const fromRole = rolePermissions.includes(perm);
                            const fromDirect = directPermissions.includes(perm);
                            const effective =
                              isAdmin ||
                              permissions.includes(perm) ||
                              permissions.includes(EPermissions.Value) ||
                              permissions.includes(EPermissions.Wg);

                            return (
                              <tr
                                key={perm}
                                className="border-b border-border hover:bg-accent"
                              >
                                <td className="px-4 py-2">
                                  <code className="text-xs text-muted-foreground">
                                    {perm}
                                  </code>
                                  <p className="text-[11px] text-muted-foreground mt-0.5">
                                    {PERMISSION_META[perm]?.description}
                                  </p>
                                </td>
                                <td className="px-4 py-2 text-center">
                                  {effective ? (
                                    <Check
                                      size={16}
                                      className="inline text-success"
                                      strokeWidth={2.5}
                                    />
                                  ) : (
                                    <X
                                      size={16}
                                      className="inline text-muted-foreground opacity-30"
                                    />
                                  )}
                                </td>
                                <td className="px-3 py-2">
                                  {effective && (
                                    <div className="flex gap-1 flex-wrap justify-end">
                                      {isAdmin && (
                                        <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-1.5 py-0.5 rounded">
                                          admin
                                        </span>
                                      )}
                                      {!isAdmin && fromRole && (
                                        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                                          через роль
                                        </span>
                                      )}
                                      {!isAdmin && fromDirect && (
                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                          напрямую
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </PageLayout>
  );
});
