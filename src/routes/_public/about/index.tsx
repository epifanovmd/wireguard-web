import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import { AboutPage } from "../../../pages/about";

export const Route = createFileRoute("/_public/about/")({
  component: () => <AboutPage />,
});
