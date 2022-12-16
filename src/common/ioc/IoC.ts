import "reflect-metadata";

import {
  Container as InversifyContainer,
  inject as Inject,
  injectable as Injectable,
  interfaces,
} from "inversify";
import getDecorators from "inversify-inject-decorators";
import { v4 } from "uuid";

export interface IIoCInterface<T> {
  readonly Tid: string;

  (options?: { inSingleton?: boolean; factory?: boolean }): (
    target: any,
    targetKey?: string,
    index?: number | undefined,
  ) => void;

  getInstance(): T;
}

interface DecoratorOptions {
  inSingleton?: boolean;
  factory?: boolean;
}

const iocContainer = new InversifyContainer();

const { lazyInject } = getDecorators(iocContainer);

function iocDecorator<TInterface>(name?: string): IIoCInterface<TInterface> {
  const tid = name || v4();

  function iocDecoratorFactory(options?: DecoratorOptions) {
    return function iocDecorator(
      target: any,
      targetKey?: string,
      index?: number | undefined,
    ) {
      if (index !== undefined) {
        // При использовании на параметре конструкра
        Inject(tid)(target, targetKey!, index);
      } else if (targetKey) {
        // При использовании на поле класса
        lazyInject(tid)(target, targetKey);
      } else {
        // При использовании на классе
        Injectable()(target);

        console.log("options", options);
        if (options?.inSingleton) {
          iocContainer.bind<TInterface>(tid).to(target).inSingletonScope();
        }
        if (options?.factory) {
          console.log("options?.factory", options?.factory);
          iocContainer
            .bind<TInterface>(tid)
            .toFactory<TInterface>((context: interfaces.Context) => {
              return (value: any) => {
                console.log("value", value);

                return context.container.get<TInterface>(tid);
              };
            });
        } else {
          iocContainer.bind<TInterface>(tid).to(target);
        }
      }
    };
  }

  iocDecoratorFactory.Tid = tid;
  iocDecoratorFactory.getInstance = () => iocContainer.get<TInterface>(tid);

  return iocDecoratorFactory;
}

export { Inject, Injectable, iocDecorator };
