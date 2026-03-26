import { LambdaValue, resolveLambdaValue } from "@utils/lambdaValue";
import { isFunction } from "@utils/typeGuards";
import { computed, makeObservable, observable } from "mobx";

export interface IDataModel<TData> {
  readonly data: TData;
}

export class DataModelBase<TData> implements IDataModel<TData> {
  private readonly _data: LambdaValue<TData>;

  constructor(value: LambdaValue<TData>) {
    this._data = value;

    makeObservable(this, {
      // @ts-expect-error _data
      _data: observable,
      data: computed,
      hasLambda: computed,
    });
  }

  public get data() {
    return resolveLambdaValue(this._data);
  }

  public get hasLambda() {
    return isFunction(this._data);
  }
}
