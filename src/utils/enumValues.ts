type EnumValueType = string | number;

export const getEnumNames = (e: any): string[] =>
  Object.keys(e).filter(key => isNaN(+key));

export const getEnumNamesAndValues = <T extends EnumValueType>(
  e: any,
): { name: string; value: T }[] =>
  getEnumNames(e).map(_name => ({
    name: _name,
    value: e[_name] as T,
  }));
