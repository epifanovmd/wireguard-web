import React, { FC, ReactNode } from "react";

import { Badge, Button, Card } from "~@components/ui";

import { UserAvatar } from "./UserAvatar";
import { UserRoleBadge } from "./UserRoleBadge";

interface UserInfoCardProps {
  displayName: string;
  login?: string;
  role?: string;
  emailVerified?: boolean;
  registeredAt?: string;
  lastOnline?: string;
  actions?: ReactNode;
}

export const UserInfoCard: FC<UserInfoCardProps> = ({
  displayName,
  login,
  role,
  emailVerified,
  registeredAt,
  lastOnline,
  actions,
}) => (
  <Card>
    <div className="flex flex-col items-center text-center gap-2.5">
      <UserAvatar name={displayName} size="lg" />
      <div>
        <p className="font-semibold text-foreground">{displayName}</p>
        {login && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {login}
          </p>
        )}
      </div>
      {role && <UserRoleBadge role={role} />}
      {emailVerified !== undefined && (
        <Badge variant={emailVerified ? "success" : "gray"} dot>
          {emailVerified ? "Email подтверждён" : "Email не подтверждён"}
        </Badge>
      )}
      {actions}
    </div>

    {(registeredAt || lastOnline) && (
      <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2 text-xs">
        {registeredAt && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {`Зарегистрирован: ${registeredAt}`}
            </span>
          </div>
        )}
        {lastOnline && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Последний визит
            </span>
            <span className="text-muted-foreground">{lastOnline}</span>
          </div>
        )}
      </div>
    )}
  </Card>
);
