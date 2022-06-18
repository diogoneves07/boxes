import { NormalBox } from "./../types/normal-box";
import ignoreBoxes from "./ignore-boxes";

function dataIntoBoxes(arrayOrBox: any, ignore?: (NormalBox | string)[]): any {
  if (Array.isArray(arrayOrBox)) {
    return arrayOrBox.map((item) => {
      if (ignoreBoxes(item, ignore)) {
        return dataIntoBoxes((item as any).get(), ignore);
      }
      return item;
    });
  }
  if (ignoreBoxes(arrayOrBox, ignore)) {
    return dataIntoBoxes((arrayOrBox as NormalBox).get(), ignore);
  }

  return arrayOrBox;
}

export default function getDataIntoBoxes(
  values: any,
  ignoreBoxes?: (NormalBox | string)[]
) {
  return dataIntoBoxes(values, ignoreBoxes);
}
