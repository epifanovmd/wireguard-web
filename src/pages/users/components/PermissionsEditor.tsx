import { FC } from "react";

import { EPermissions, ERole } from "~@api/api-gen/data-contracts";
import { Checkbox, cn } from "~@components/ui";
import { hasPermission } from "~@core/permissions";

interface PermissionItem {
  value: EPermissions;
  label: string;
  description: string;
}

interface PermissionGroup {
  label: string;
  wildcard?: EPermissions;
  items: PermissionItem[];
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "Серверы WireGuard",
    wildcard: EPermissions.WgServer,
    items: [
      {
        value: EPermissions.WgServerView,
        label: "Просмотр",
        description: "Список и детали серверов",
      },
      {
        value: EPermissions.WgServerManage,
        label: "Управление",
        description: "Создание, редактирование, удаление серверов",
      },
      {
        value: EPermissions.WgServerControl,
        label: "Контроль",
        description: "Запуск, остановка, перезапуск серверов",
      },
    ],
  },
  {
    label: "Пиры WireGuard",
    wildcard: EPermissions.WgPeer,
    items: [
      {
        value: EPermissions.WgPeerView,
        label: "Просмотр",
        description: "Список и детали пиров",
      },
      {
        value: EPermissions.WgPeerManage,
        label: "Управление",
        description: "Создание, редактирование, удаление пиров",
      },
      {
        value: EPermissions.WgPeerOwn,
        label: "Только свои пиры",
        description: "Доступ только к назначенным пирам пользователя",
      },
    ],
  },
  {
    label: "Статистика",
    wildcard: EPermissions.WgStats,
    items: [
      {
        value: EPermissions.WgStatsView,
        label: "Просмотр",
        description: "Просмотр трафика и скорости",
      },
      {
        value: EPermissions.WgStatsExport,
        label: "Экспорт",
        description: "Скачивание и экспорт данных",
      },
    ],
  },
  {
    label: "Пользователи",
    items: [
      {
        value: EPermissions.UserView,
        label: "Просмотр",
        description: "Список и детали пользователей",
      },
      {
        value: EPermissions.UserManage,
        label: "Управление",
        description: "Назначение прав, удаление пользователей",
      },
    ],
  },
];

interface PermissionsEditorProps {
  /** Прямые права пользователя (редактируемые) */
  value: EPermissions[];
  onChange: (perms: EPermissions[]) => void;
  /** Права, унаследованные от роли (read-only, только для отображения) */
  rolePermissions?: EPermissions[];
  /** Роль пользователя — если admin, все чекбоксы неактивны с пометкой "через роль" */
  role?: ERole;
}

export const PermissionsEditor: FC<PermissionsEditorProps> = ({
  value,
  onChange,
  rolePermissions = [],
  role,
}) => {
  const isAdminRole = role === ERole.Admin;

  const isFromRole = (perm: EPermissions) =>
    hasPermission(rolePermissions as EPermissions[], perm);

  const isDirect = (perm: EPermissions) => value.includes(perm);

  const isEffective = (perm: EPermissions) =>
    isAdminRole || isFromRole(perm) || isDirect(perm);

  const toggleDirect = (perm: EPermissions) => {
    if (isFromRole(perm) || isAdminRole) return;
    if (value.includes(perm)) {
      onChange(value.filter(p => p !== perm));
    } else {
      onChange([...value, perm]);
    }
  };

  const toggleGroupWildcard = (wildcard: EPermissions, groupItems: PermissionItem[]) => {
    if (isAdminRole) return;
    const alreadyHas = value.includes(wildcard);

    if (alreadyHas) {
      onChange(value.filter(p => p !== wildcard));
    } else {
      // добавляем wildcard, убираем дублирующие конкретные права
      const itemValues = groupItems.map(i => i.value);

      onChange([...value.filter(p => !itemValues.includes(p)), wildcard]);
    }
  };

  const isWildcardEffective = (wildcard: EPermissions) =>
    isAdminRole ||
    hasPermission(rolePermissions as EPermissions[], wildcard) ||
    value.includes(wildcard);

  return (
    <div className="flex flex-col gap-5">
      {/* Wildcard всё */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <Checkbox
          checked={isAdminRole || value.includes(EPermissions.Value)}
          onCheckedChange={() => {
            if (isAdminRole) return;
            if (value.includes(EPermissions.Value)) {
              onChange(value.filter(p => p !== EPermissions.Value));
            } else {
              onChange([EPermissions.Value]);
            }
          }}
          disabled={isAdminRole}
        />
        <div className="flex-1">
          <p className="text-sm font-medium">Суперправо <code className="text-xs bg-muted px-1 rounded">*</code></p>
          <p className="text-xs text-muted-foreground">Полный доступ ко всему (аналог роли Admin)</p>
        </div>
        {isAdminRole && (
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
            через роль
          </span>
        )}
      </div>

      {/* Wildcard wg:* */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <Checkbox
          checked={
            isAdminRole ||
            hasPermission(rolePermissions as EPermissions[], EPermissions.Wg) ||
            value.includes(EPermissions.Value) ||
            value.includes(EPermissions.Wg)
          }
          onCheckedChange={() => {
            if (isAdminRole || value.includes(EPermissions.Value)) return;
            if (value.includes(EPermissions.Wg)) {
              onChange(value.filter(p => p !== EPermissions.Wg));
            } else {
              onChange([...value.filter(p => !p.startsWith("wg:")), EPermissions.Wg]);
            }
          }}
          disabled={
            isAdminRole ||
            value.includes(EPermissions.Value) ||
            hasPermission(rolePermissions as EPermissions[], EPermissions.Wg)
          }
        />
        <div className="flex-1">
          <p className="text-sm font-medium">Всё WireGuard <code className="text-xs bg-muted px-1 rounded">wg:*</code></p>
          <p className="text-xs text-muted-foreground">Полный доступ ко всем WG серверам, пирам и статистике</p>
        </div>
        {(isAdminRole || hasPermission(rolePermissions as EPermissions[], EPermissions.Wg)) && (
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
            через роль
          </span>
        )}
      </div>

      {/* Группы прав */}
      {PERMISSION_GROUPS.map(group => {
        const wildcardEffective = group.wildcard
          ? isWildcardEffective(group.wildcard)
          : false;
        const wildcardFromRole = group.wildcard
          ? hasPermission(rolePermissions as EPermissions[], group.wildcard)
          : false;

        return (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.wildcard && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <Checkbox
                    checked={wildcardEffective}
                    onCheckedChange={() =>
                      group.wildcard &&
                      toggleGroupWildcard(group.wildcard, group.items)
                    }
                    disabled={
                      isAdminRole ||
                      wildcardFromRole ||
                      value.includes(EPermissions.Value) ||
                      value.includes(EPermissions.Wg)
                    }
                  />
                  <span className="text-xs text-muted-foreground">
                    <code className="bg-muted px-1 rounded">{group.wildcard}</code>
                  </span>
                  {(wildcardFromRole || wildcardEffective && (isAdminRole || value.includes(EPermissions.Wg) || value.includes(EPermissions.Value))) && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      через роль
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 pl-1">
              {group.items.map(item => {
                const fromRole = isFromRole(item.value);
                const effective = isEffective(item.value);
                const direct = isDirect(item.value);
                const inheritedViaWildcard =
                  effective && !direct && !isAdminRole;

                return (
                  <div
                    key={item.value}
                    className={cn(
                      "flex items-start gap-3 p-2 rounded-md transition-colors",
                      effective && "bg-primary/5",
                    )}
                  >
                    <Checkbox
                      checked={effective}
                      onCheckedChange={() => toggleDirect(item.value)}
                      disabled={
                        isAdminRole ||
                        fromRole ||
                        inheritedViaWildcard
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm">{item.label}</span>
                        <code className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
                          {item.value}
                        </code>
                        {(fromRole || isAdminRole || inheritedViaWildcard) && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            через роль
                          </span>
                        )}
                        {direct && !fromRole && !isAdminRole && (
                          <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            напрямую
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
