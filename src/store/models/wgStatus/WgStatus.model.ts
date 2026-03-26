import { EWgServerStatus } from "@api/api-gen/data-contracts";
import { createEnumModelBase } from "@store/models";

export const WgStatusModel =
  createEnumModelBase<typeof EWgServerStatus>(EWgServerStatus);
