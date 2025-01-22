import { createLazyFileRoute } from "@tanstack/react-router";

import { CallPage } from "../../pages/call";

export const Route = createLazyFileRoute("/_private/call")({
  component: CallPage,
});
