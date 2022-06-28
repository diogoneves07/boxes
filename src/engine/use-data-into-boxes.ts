import { NormalBox } from "./../types/normal-box";
import notIgnoreBox from "./not-ignore-box";

function dataIntoBoxes(arrayOrBox: any, ignore?: (NormalBox | string)[]): any {
  if (Array.isArray(arrayOrBox)) {
    return arrayOrBox.map((item) => {
      if (notIgnoreBox(item, ignore)) {
        return (item as NormalBox).getDataInBoxes(ignore);
      }
      return item;
    });
  }
  if (notIgnoreBox(arrayOrBox, ignore)) {
    return (arrayOrBox as NormalBox).getDataInBoxes(ignore);
  }

  return arrayOrBox;
}

export default function getDataInBoxes(
  values: any,
  notIgnoreBox?: (NormalBox | string)[]
) {
  return dataIntoBoxes(values, notIgnoreBox);
}
