export type DivideOpt = { separator?: string };

export const stringToNumber = (value: string | number = "") => {
  return parseFloat(String(value).replace(/,/g, "."));
};

export const toDivide = (num: number, opt?: DivideOpt) => {
  const int = String(Math.trunc(Number(num || 0)));

  if (int.length <= 3) {
    return int;
  }
  let space = 0;
  let number = "";

  // eslint-disable-next-line no-plusplus
  for (let i = int.length - 1; i >= 0; i--) {
    if (space == 3) {
      number = `${opt?.separator || " "}${number}`;
      space = 0;
    }
    number = int.charAt(i) + number;
    space += 1;
  }

  return number;
};
