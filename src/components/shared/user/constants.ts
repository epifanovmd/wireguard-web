import { ERole } from "~@api/api-gen/data-contracts";

export const ROLE_BADGE_VARIANT: Record<ERole, "purple" | "info" | "gray"> = {
  [ERole.Admin]: "purple",
  [ERole.User]: "info",
  [ERole.Guest]: "gray",
};
