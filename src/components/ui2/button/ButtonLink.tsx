import {
  type LinkProps,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import React, { useCallback } from "react";

import { AsyncButton, ButtonProps } from "../button";

export interface ButtonLinkProps extends ButtonProps {
  to?: LinkProps["to"];
  params?: LinkProps["params"];
  search?: LinkProps["search"];
}

export const ButtonLink = React.forwardRef<HTMLButtonElement, ButtonLinkProps>(
  ({ to, params, search, variant, size, ...props }, ref) => {
    const state = useRouterState();
    const navigate = useNavigate();

    const path = state.location.pathname;
    const isActive = to === "/" ? path === "/" : to && path.startsWith(to);

    const onNavigate = useCallback(() => {
      return navigate({ to, params, search });
    }, [navigate, params, search, to]);

    return (
      <AsyncButton
        ref={ref}
        variant={isActive ? "secondary" : "ghost"}
        size="sm"
        onClick={onNavigate}
        {...props}
      />
    );
  },
);

ButtonLink.displayName = "ButtonLink";
