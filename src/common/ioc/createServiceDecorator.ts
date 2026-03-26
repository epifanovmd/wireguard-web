import "reflect-metadata";

import { inject, injectable, optional } from "inversify";
import decorators from "inversify-inject-decorators";
import shortid from "shortid";

import { iocContainer } from "./container";

export interface IIoCDecoratorOptions {
  inSingleton?: boolean;
  optional?: true;
}

export interface IoCServiceDecorator<T> {
  readonly Tid: string;

  (options?: IIoCDecoratorOptions): (
    target: any,
    targetKey?: string,
    index?: number | undefined,
  ) => void;

  getInstance(options?: { optional?: true }): T;
}

const { lazyInject } = decorators(iocContainer);

function createServiceDecorator<TInterface>(): IoCServiceDecorator<TInterface> {
  const name: string = shortid();

  function serviceDecoratorFactory(options?: IIoCDecoratorOptions) {
    return function serviceDecorator(
      target: any,
      targetKey?: string,
      index?: number | undefined,
    ) {
      if (index !== undefined) {
        inject(name)(target, targetKey!, index);
        if (options?.optional) {
          optional()(target, targetKey!, index);
        }
      } else if (targetKey) {
        if (options?.optional) {
          inject(name)(target, targetKey);
          optional()(target, targetKey);
        } else {
          lazyInject(name)(target, targetKey);
        }
      } else {
        injectable()(target);
        if (!iocContainer.isBound(name)) {
          const binding = iocContainer.bind<TInterface>(name).to(target);

          if (options?.inSingleton) {
            binding.inSingletonScope();
          }
        }
      }
    };
  }

  serviceDecoratorFactory.Tid = name;

  serviceDecoratorFactory.getInstance = (options?: { optional?: true }) => {
    const isOpt = options?.optional ?? false;
    const isBound = iocContainer.isBound(name);

    return (isBound || !isOpt ? iocContainer.get<TInterface>(name) : undefined) as TInterface;
  };

  return serviceDecoratorFactory as IoCServiceDecorator<TInterface>;
}

export { createServiceDecorator };
