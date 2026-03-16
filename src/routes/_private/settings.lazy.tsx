import { createLazyFileRoute } from "@tanstack/react-router";

import { Settings } from "../../pages/settings";

export const Route = createLazyFileRoute("/_private/settings")({
  component: Settings,
});
