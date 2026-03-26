import { EWgServerStatus } from "~@api/api-gen/data-contracts";
import { createEnumModelBase } from "~@common/store/models";

export const WgStatusModel =
  createEnumModelBase<typeof EWgServerStatus>(EWgServerStatus);
