import { createEnumModelBase } from "@force-dev/utils";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";

export const WgStatusModel =
  createEnumModelBase<typeof EWgServerStatus>(EWgServerStatus);
