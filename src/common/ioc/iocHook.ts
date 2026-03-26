import { useRef } from "react";

import { IoCServiceDecorator } from "./createServiceDecorator";

export const iocHook =
  <T>(ioc: IoCServiceDecorator<T>) =>
  () =>
    useRef(ioc.getInstance()).current;
