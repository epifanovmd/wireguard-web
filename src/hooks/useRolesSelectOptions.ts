import { useCallback, useEffect, useState } from "react";

import { useApi } from "~@api";
import { EPermissions, ERole, IRoleDto } from "~@api/api-gen/data-contracts";
import { RoleModel } from "~@models";

export const useRolesSelectOptions = () => {
  const api = useApi();
  const [roles, setRoles] = useState<IRoleDto[]>([]);

  useEffect(() => {
    load().then();
    // eslint-disable-next-line
  }, [api]);

  const load = useCallback(() => {
    return api
      .getRoles()
      .then(res => setRoles((res.data ?? []).sort()))
      .catch(() => {});
    // eslint-disable-next-line
  }, []);

  const options = roles.map(r => {
    const model = new RoleModel(r.name);

    return {
      value: r.name as ERole,
      label: model.label,
    };
  });

  const getRolePermissions = useCallback(
    (roleName: string): EPermissions[] => {
      const role = roles.find(r => r.name === roleName);

      return role?.permissions.map(p => p.name as EPermissions) ?? [];
    },
    [roles],
  );

  return { options, roles, getRolePermissions, load };
};
