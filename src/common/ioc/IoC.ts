import "reflect-metadata";

import {
  Container as InversifyContainer,
  inject as Inject,
  injectable as Injectable,
} from "inversify";
import getDecorators from "inversify-inject-decorators";
import { v4 } from "uuid";

export interface IoCDecoratorOptions {
  inSingleton?: boolean;
}

export interface IoCDecorator<T> {
  readonly Tid: string;

  (options?: IoCDecoratorOptions): (
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

function iocDecorator<TInterface>(): IoCDecorator<TInterface> {
  const tid = v4();

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

        if (options?.inSingleton) {
          iocContainer.bind<TInterface>(tid).to(target).inSingletonScope();
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
