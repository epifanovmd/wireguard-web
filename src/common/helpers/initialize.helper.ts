import { disposer } from "./disposer.helper";
import { InitializeDispose } from "./types";

export const initialize =
  (data: InitializeDispose | InitializeDispose[]) => () => {
    disposer(data);
  };
