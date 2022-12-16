import { makeAutoObservable, when } from "mobx";

import {
  isFunction,
  LambdaValueHelper,
  resolveLambdaValue,
} from "../../helpers";

export class ValueHolder<T> {
  private _value: LambdaValueHelper<T>;

  constructor(value: LambdaValueHelper<T>) {
    this._value = value;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setValue(value: LambdaValueHelper<T>) {
    this._value = value;
  }

  public get value() {
    return resolveLambdaValue(this._value);
  }

  public get isLambda() {
    return isFunction(this._value);
  }

  public whenChanged() {
    const value = this.value;

    return when(() => this.value !== value);
  }
}
