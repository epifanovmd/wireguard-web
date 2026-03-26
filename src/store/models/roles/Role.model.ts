import { ERole } from "@api/api-gen/data-contracts";
import { createEnumModelBase } from "@store/models";

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
