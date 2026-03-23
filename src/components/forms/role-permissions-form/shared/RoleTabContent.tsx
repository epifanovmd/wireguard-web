import { memo } from "react";

import { EPermissions, ERole, IRoleDto } from "~@api/api-gen/data-contracts";
import { AsyncButton, Button } from "~@components/ui";

import { PermissionsEditor } from "../../permissions-editor";
import { AdminRoleNotice } from "./AdminRoleNotice";

export interface RoleTabContentProps {
  role: IRoleDto;
  perms: EPermissions[];
  changed: boolean;
  saving: boolean;
  onChangePerms: (roleId: string, perms: EPermissions[]) => void;
  onSave: (role: IRoleDto) => void;
  onReset: (role: IRoleDto) => void;
}

export const RoleTabContent = memo<RoleTabContentProps>(
  ({ role, perms, changed, saving, onChangePerms, onSave, onReset }) => {
    const isAdmin = role.name === ERole.Admin;

    return (
      <div className="flex flex-col gap-4 mt-4">
        {isAdmin ? (
          <AdminRoleNotice />
        ) : (
          <div className={"flex flex-col gap-4"}>
            <PermissionsEditor
              value={perms}
              onChange={params => onChangePerms(role.id, params)}
            />
            <div className={"border-t border-border"} />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!changed || saving}
                onClick={() => onReset(role)}
              >
                Сбросить
              </Button>
              <AsyncButton
                size="sm"
                disabled={!changed}
                loading={saving}
                onClick={() => onSave(role)}
              >
                Сохранить
              </AsyncButton>
            </div>
          </div>
        )}
      </div>
    );
  },
);
