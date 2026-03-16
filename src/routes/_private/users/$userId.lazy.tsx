import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import React from "react";

import { UserDetail } from "../../../pages/users";

const Component = () => {
  const navigate = useNavigate();
  const { userId } = useParams({ from: "/_private/users/$userId" });
  return (
    <UserDetail userId={userId} onBack={() => navigate({ to: "/users" })} />
  );
};

export const Route = createLazyFileRoute("/_private/users/$userId")({
  component: Component,
});
