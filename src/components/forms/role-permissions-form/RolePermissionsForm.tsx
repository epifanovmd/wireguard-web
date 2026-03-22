import { FC, memo } from "react";

import { ERole } from "~@api/api-gen/data-contracts";
import { Badge, Card, Spinner, Tabs } from "~@components/ui";
import { RoleModel } from "~@models";

import { useRolePermissionsForm } from "./hooks";
import { RoleTabContent } from "./shared";

const ROLE_BADGE_VARIANT: Record<string, "purple" | "info" | "gray"> = {
  [ERole.Admin]: "purple",
  [ERole.User]: "info",
  [ERole.Guest]: "gray",
};

export const RolePermissionsForm: FC = memo(() => {
  const {
    roles,
    editedPerms,
    savingId,
    setRolePerms,
    saveRole,
    resetRole,
    hasChanges,
  } = useRolePermissionsForm();

  if (roles.length === 0) {
    return (
      <Card title="Права ролей" className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner size="sm" />
          {"Загрузка..."}
        </div>
      </Card>
    );
  }

  const defaultTab =
    roles.find(r => r.name !== ERole.Admin)?.id ?? roles[0]?.id;

  return (
    <Card title="Права ролей" className="overflow-hidden p-5">
      <p className="text-xs text-muted-foreground pt-3 pb-1">
        {"Права назначаются ролям и автоматически применяются ко всем"}
        {"пользователям с этой ролью. Изменения вступают в силу при следующем"}
        {"входе пользователя."}
      </p>
      <Tabs defaultValue={defaultTab} className="pb-5 pt-3">
        <Tabs.List variant={"underline"}>
          {roles.map(role => {
            const model = new RoleModel(role.name);

            return (
              <Tabs.Trigger key={role.id} value={role.id} className={"px-1"}>
                <Badge
                  size={"sm"}
                  variant={ROLE_BADGE_VARIANT[role.name] ?? "gray"}
                >
                  {model.label}
                  {hasChanges(role) && (
                    <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-warning/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning block" />
                    </div>
                  )}
                </Badge>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

        {roles.map(role => (
          <Tabs.Content key={role.id} value={role.id}>
            <RoleTabContent
              role={role}
              perms={editedPerms[role.id] ?? []}
              changed={hasChanges(role)}
              saving={savingId === role.id}
              onChangePerms={setRolePerms}
              onSave={saveRole}
              onReset={resetRole}
            />
          </Tabs.Content>
        ))}
      </Tabs>
    </Card>
  );
});
