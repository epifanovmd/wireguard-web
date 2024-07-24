import { Link as _Link } from "@tanstack/react-router";
import React, { ComponentProps, FC, memo } from "react";

export const Link: FC<ComponentProps<typeof _Link>> = memo(props => {
  return <_Link to={props.href}>{props.children}</_Link>;
});
