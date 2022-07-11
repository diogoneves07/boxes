import { NormalBox } from "../types/normal-box";
import hasOwnProperty from "../utilities/hasOwnProperty";
/**
 * Checks if the box should not be ignored.
 */
export default function notIgnoreBox(
  value: any,
  ignore?: (string | NormalBox)[]
) {
  const isBox = hasOwnProperty(value, "isBox");
  return isBox &&
    (!ignore ||
      !ignore.find(
        (item) =>
          value === item ||
          (isBox && (value as NormalBox).wrappers.has(item as string))
      ))
    ? true
    : false;
}
