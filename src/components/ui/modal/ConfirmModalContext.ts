import { createContext } from "react";

import { IConfirmModalContext } from "./ConfirmModalProvider";

export const ConfirmModalContext = createContext<IConfirmModalContext>(
  undefined as unknown as IConfirmModalContext,
);
