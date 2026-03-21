import { EPermissions } from "~@api/api-gen/data-contracts";

export interface PermissionItem {
  value: EPermissions;
  label: string;
  description: string;
}

export interface PermissionGroup {
  label: string;
  wildcard?: EPermissions;
  items: PermissionItem[];
}
