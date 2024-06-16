import { computed } from "mobx";

import {
  EnumValuesHelper,
  LambdaValueHelper,
  Maybe,
  stringCapitalize,
} from "../../helpers";
import { DataModelBase } from "./DataModelBase";

type TEnumProps<TEnum> = {
  [K in keyof TEnum as `is${Capitalize<string & K>}`]: boolean;
};
type EnumValue<TEnum> = TEnum[keyof TEnum];
type ModelClassType<T, TEnum> = new (
  enm: LambdaValueHelper<Maybe<EnumValue<TEnum>>>,
) => T;
type TEnumModelBase<TEnum> = ModelClassType<
  TEnumProps<TEnum> & DataModelBase<Maybe<EnumValue<TEnum>>>,
  TEnum
>;

export function createEnumModelBase<TEnum>(enm: any) {
  class EnumModel extends DataModelBase<Maybe<EnumValue<TEnum>>> {}

  // Тут генерируем реализацию проверочных пропсов по каждому полю энума, которые соответствуют типу TEnumProps
  EnumValuesHelper.getNamesAndValues<any>(enm).forEach(item => {
    const key = `is${stringCapitalize(item.name)}`;

    Object.defineProperty(EnumModel.prototype, key, {
      get() {
        return this.data === item.value;
      },
    });

    computed(EnumModel, key);
  });

  return EnumModel as TEnumModelBase<TEnum>;
}
