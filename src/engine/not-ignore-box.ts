import { NormalBox } from "../types/normal-box";
/**
 * Checks if the box should not be ignored.
 */
export default function notIgnoreBox(
  value: any,
  ignore?: (string | NormalBox)[]
) {
  const isBox = value && (value as NormalBox).isBox;
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
