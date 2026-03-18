import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { Profile } from "../../pages/profile/Profile";

export const Route = createLazyFileRoute("/_private/profile")({
  component: Profile,
});
