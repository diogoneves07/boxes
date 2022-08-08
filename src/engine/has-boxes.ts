import { NormalBox } from "./../types/normal-box";
import isBox from "./is-box";
function hasInIgnoreBoxes(box: NormalBox, ignoreBoxes: any[]) {
  for (const wrapper of box.wrappers) {
    if (ignoreBoxes.includes(wrapper)) {
      return true;
    }
  }
  return false;
}
/**
 * Checks if there are boxes between the values ​​passed.
 * @param values
 * The value to be checked.
 * @param ignoreBoxes
 * The boxes or types of boxes that should be ignored.
 * @returns boolean
 */
export function hasBoxes(
  values: any[] | NormalBox,
  ignoreBoxes?: NormalBox | string | (NormalBox | string)[]
) {
  const ignoreBoxesArray = Array.isArray(ignoreBoxes)
    ? ignoreBoxes
    : [ignoreBoxes];

  let value: any = values;

  if (values && isBox(values)) {
    const contents = values as NormalBox;
    value = Array.isArray(contents) ? contents : [contents];
  }

  if (value && Array.isArray(value)) {
    return value.find((item) => {
      return (
        item &&
        !ignoreBoxesArray.includes(item) &&
        !(isBox(item) && hasInIgnoreBoxes(item, ignoreBoxesArray)) &&
        isBox(item)
      );
    })
      ? true
      : false;
  }
  return false;
}
