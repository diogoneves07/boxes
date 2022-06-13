import { NormalBox } from "./../types/normal-box";
import ignoreBoxes from "./ignore-boxes";

function getDataIntoBoxes(
  arrayOrBox: any,
  ignore?: (NormalBox | string)[]
): any {
  if (Array.isArray(arrayOrBox)) {
    return arrayOrBox.map((value) => {
      if (ignoreBoxes(value, ignore)) {
        return getDataIntoBoxes((value as any).get(), ignore);
      }
      return value;
    });
  }
  if (ignoreBoxes(arrayOrBox, ignore)) {
    return getDataIntoBoxes((arrayOrBox as NormalBox).get(), ignore);
  }

  return arrayOrBox;
}

export default function useDataIntoBoxes(
  values: any,
  ignoreBoxes?: (NormalBox | string)[]
) {
  const wasArray = Array.isArray(values);
  const valuesWithoutBoxe = getDataIntoBoxes(
    wasArray ? values : [values],
    ignoreBoxes
  );
  return wasArray ? valuesWithoutBoxe : valuesWithoutBoxe[0];
}
