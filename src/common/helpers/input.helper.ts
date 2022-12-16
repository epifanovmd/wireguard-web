import { DivideOpt, toDivide } from "./number.helper";

type Options = {
  type: "text" | "number" | "floating";
  divide?: boolean;
  divideOpt?: DivideOpt;
};

export const replaceInputString = (
  text: string,
  { type, divide, divideOpt }: Options,
) => {
  let _value = "";

  if (text === "") {
    return "";
  }

  if (type === "text") {
    _value = text;
  } else if (type === "number") {
    _value = Number(text.replace(/,/g, ".").replace(/[^0-9]/g, "")).toString();
    if (divide) {
      _value = toDivide(Number(_value), divideOpt);
    }
  } else if (type === "floating") {
    _value = text
      .replace(/,/g, ".")
      .replace(/[^0-9.]/g, "")
      .replace(/^([^\\.]*\.)|\./g, "$1");

    if (_value === ".") {
      _value = "0.";
    }

    if (_value[0] === "0" && _value[1] && _value[1] !== ".") {
      _value = Number(_value).toString();
    }
  } else {
    _value = text;
  }

  return _value;
};
