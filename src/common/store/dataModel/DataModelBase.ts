import isFunction from "lodash/isFunction";
import { computed } from "mobx";

import { LambdaValueHelper, resolveLambdaValue } from "../../helpers";
import { IDataModel } from "./DataModel.types";

export class DataModelBase<TData> implements IDataModel<TData> {
  private readonly _data: LambdaValueHelper<TData>;

  constructor(value: LambdaValueHelper<TData>) {
    this._data = value;
  }

  @computed
  public get data() {
    return resolveLambdaValue(this._data);
  }

  @computed
  public get hasLambda() {
    return isFunction(this._data);
  }
}
