import { NormalBox } from "../types/normal-box";
import isBox from "./is-box";

/**
 * Checks if the box should not be ignored.
 */
export default function notIgnoreBox(
  value: any,
  ignore?: (string | NormalBox)[]
) {
  const is = isBox(value);
  return is &&
    (!ignore ||
      !ignore.find(
        (item) =>
          value === item ||
          (is && (value as NormalBox).wrappers.has(item as string))
      ))
    ? true
    : false;
}
