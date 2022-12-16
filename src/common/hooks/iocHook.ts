import { isEqual } from "lodash";
import { useRef } from "react";

import { IIoCInterface } from "../ioc";

export interface IBaseViewModel<Props> {
  setProps: (props: Props) => void;
}

interface IocHook {
  <Props, T extends IBaseViewModel<Props> | unknown>(
    ioc: IIoCInterface<T>,
  ): Omit<T, keyof IBaseViewModel<Props>> extends T
    ? () => T
    : (props: Props) => Omit<T, keyof IBaseViewModel<Props>>;
}

export const iocHook: IocHook = ioc =>
  ((props: any) => {
    const instance = useRef<any>(ioc.getInstance()).current;

    if (
      instance &&
      typeof instance === "object" &&
      typeof instance.setProps === "function" &&
      props &&
      !isEqual(instance.props, props)
    ) {
      instance.setProps(props);
    }

    return instance;
  }) as any;
