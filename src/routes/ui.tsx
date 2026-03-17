import { createFileRoute } from "@tanstack/react-router";

import { UIPage } from "../pages/ui";

export const Route = createFileRoute("/ui")({
  component: UIPage,
});
