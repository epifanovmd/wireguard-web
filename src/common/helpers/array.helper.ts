export const groupByKeyValue = <
  A extends any[],
  Key extends keyof A[number] = keyof A[number],
>(
  array: A,
  key: Key,
) =>
  array.reduce<{ [key in string]?: A[number] }>((acc, item) => {
    acc[item[key]] = item;

    return acc;
  }, {});
