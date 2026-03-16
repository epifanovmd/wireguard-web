import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

import { UsersList } from "../../../pages/users/UsersList";

export const Route = createLazyFileRoute("/_private/users/")({
  component: () => <UsersList />,
});
