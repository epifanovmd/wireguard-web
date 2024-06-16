import { useRef } from "react";

import { IoCDecorator } from "../ioc";

export const iocHook =
  <T>(ioc: IoCDecorator<T>) =>
  () =>
    useRef<T>(ioc.getInstance()).current;
