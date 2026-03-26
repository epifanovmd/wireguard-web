import { EWgServerStatus } from "@api/api-gen/data-contracts";

import { createEnumModelBase } from "../EnumModelBase";

export const WgStatusModel =
  createEnumModelBase<typeof EWgServerStatus>(EWgServerStatus);
