import { NormalBox } from "./../types/normal-box";
export default function ignoreBoxes(
  value: any,
  ignore?: (string | NormalBox)[]
) {
  return value &&
    (value as NormalBox).isBox &&
    (!ignore ||
      !ignore.find(
        (item) => value === item || value.type === (item as NormalBox).type
      ))
    ? true
    : false;
}
