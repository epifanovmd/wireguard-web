import React, { memo } from "react";
import { NavLink } from "react-router-dom";

export const Link = memo((props: { href: string; children: string }) => {
  return <NavLink to={props.href}>{props.children}</NavLink>;
});
