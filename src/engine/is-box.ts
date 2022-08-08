import { IS_BOX } from "./boxes-symbols";
import hasOwnProperty from "../utilities/hasOwnProperty";

export default function isBox(value: any) {
  return value && hasOwnProperty(value, IS_BOX) ? true : false;
}
