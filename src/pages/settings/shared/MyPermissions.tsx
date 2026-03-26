import { EPermissions, ERole } from "@api/api-gen/data-contracts";
import { UserRoleBadge } from "@components/shared";
import { Badge, Card } from "@components/ui";
import { useAuthStore, usePermissions } from "@store";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { PermissionsTable } from "./PermissionsTable";

export const MyPermissions: FC = observer(() => {
  const { user } = useAuthStore();
  const { isAdmin, directPermissions, roles } = usePermissions();

  const rolePermissions =
    user?.roles.flatMap(r => r.permissions.map(p => p.name as EPermissions)) ??
    [];

  return (
    <>
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
                roles.map(role => <UserRoleBadge key={role} role={role} />)
              ) : (
                <span className="text-sm text-muted-foreground">Нет ролей</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-muted-foreground">Статус доступа</dt>
            <dd>
              <Badge variant={isAdmin ? "purple" : "success"} dot>
                {isAdmin ? "Полный" : "Ограниченный"}
              </Badge>
            </dd>
          </div>
        </dl>
      </Card>

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

      <PermissionsTable rolePermissions={rolePermissions} />
    </>
  );
});
