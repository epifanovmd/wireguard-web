import { EPermissions, ERole } from "@api/api-gen/data-contracts";
import { PERMISSION_GROUPS } from "@components/forms/permissions-editor/constants";
import { PermissionSourceBadge, UserRoleBadge } from "@components/shared";
import { Badge, Card } from "@components/ui";
import { usePermissions } from "@store";
import { Check, X } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

interface Props {
  rolePermissions: EPermissions[];
}

export const PermissionsTable: FC<Props> = observer(({ rolePermissions }) => {
  const { isAdmin, permissions, directPermissions } = usePermissions();

  return (
    <Card title="Права доступа" className="overflow-hidden">
      <p className="text-xs text-muted-foreground px-4 pt-3 pb-2">
        {isAdmin
          ? "Администратор — доступ ко всему без ограничений."
          : "Итоговые права = права роли + прямые права. Wildcards покрывают все дочерние права."}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {PERMISSION_GROUPS.map(group =>
              group.items.map((item, idx) => {
                const fromRole = rolePermissions.includes(item.value);
                const fromDirect = directPermissions.includes(item.value);
                const effective =
                  isAdmin ||
                  permissions.includes(item.value) ||
                  permissions.includes(EPermissions.Value) ||
                  permissions.includes(EPermissions.Wg);

                return (
                  <>
                    {idx === 0 && (
                      <tr key={`group-${group.label}`} className="bg-muted/50">
                        <td
                          colSpan={3}
                          className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                        >
                          {group.label}
                        </td>
                      </tr>
                    )}
                    <tr
                      key={item.value}
                      className="border-b border-border hover:bg-accent"
                    >
                      <td className="px-4 py-2">
                        <code className="text-xs text-muted-foreground">
                          {item.value}
                        </code>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {effective ? (
                          <Check size={16} className="text-success" />
                        ) : (
                          <X
                            size={16}
                            className="text-muted-foreground opacity-30"
                          />
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {effective && (
                          <div className="flex gap-1 flex-wrap justify-end">
                            {isAdmin && <UserRoleBadge role={ERole.Admin} />}
                            <PermissionSourceBadge
                              fromRole={!isAdmin && fromRole}
                              direct={!isAdmin && fromDirect}
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  </>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
