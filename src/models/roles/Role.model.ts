import { createEnumModelBase } from "@force-dev/utils";

import { ERole } from "~@api/api-gen/data-contracts";

const ROLE_MAP: Record<ERole, string> = {
  [ERole.Admin]: "Администратор",
  [ERole.User]: "Пользователь",
  [ERole.Guest]: "Гость",
};

const RoleModelBase = createEnumModelBase<typeof ERole>(ERole);

export class RoleModel extends RoleModelBase {
  get label() {
    return this.data && ROLE_MAP[this.data];
  }
}
