import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

import { AboutPage } from "../../../pages/about";

export const Route = createLazyFileRoute("/_public/about/")({
  component: () => <AboutPage />,
});
