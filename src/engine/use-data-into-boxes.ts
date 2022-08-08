import { NormalBox } from "./../types/normal-box";
import notIgnoreBox from "./not-ignore-box";
import getBoxInternalData from "./get-box-internal-data";

function dataIntoBoxes(arrayOrBox: any, ignore?: (NormalBox | string)[]): any {
  if (Array.isArray(arrayOrBox)) {
    return arrayOrBox.map((item) => {
      if (notIgnoreBox(item, ignore)) {
        return getDataInBoxes(
          getBoxInternalData(item as NormalBox).contents,
          ignore
        );
      }
      return item;
    });
  }
  if (notIgnoreBox(arrayOrBox, ignore)) {
    return getDataInBoxes(
      getBoxInternalData(arrayOrBox as NormalBox).contents,
      ignore
    );
  }

  return arrayOrBox;
}

export default function getDataInBoxes(
  values: any,
  notIgnoreBox?: (NormalBox | string)[]
) {
  return dataIntoBoxes(values, notIgnoreBox);
}
