import { EPermissions } from "@api/api-gen/data-contracts";
import { usePermissions } from "@store";
import { observer } from "mobx-react-lite";
import { FC, ReactNode } from "react";

interface CanAccessProps {
  /** Право, которое нужно проверить */
  permission: EPermissions;
  /** Что рендерить при наличии права */
  children: ReactNode;
  /** Что рендерить при отсутствии права (по умолчанию ничего) */
  fallback?: ReactNode;
}

/**
 * Условный рендер на основе прав текущего пользователя.
 * Поддерживает wildcard-иерархию (admin bypass включён).
 *
 * @example
 * <CanAccess permission={EPermissions.WgServerManage}>
 *   <Button>Создать сервер</Button>
 * </CanAccess>
 */
export const CanAccess: FC<CanAccessProps> = observer(
  ({ permission, children, fallback = null }) => {
    const { hasPermission } = usePermissions();

    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
  },
);
