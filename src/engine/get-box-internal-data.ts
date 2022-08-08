import { NormalBoxInternalData } from "./../types/normal-box-internal-data";
import { AnyBox } from "./../types/boxes";
import { BOX_INTERNAL_DATA } from "./boxes-symbols";

/**
 * The data necessary for the functioning of the library.
 * */
export default function getBoxInternalData(box: AnyBox) {
  return (box as any)[BOX_INTERNAL_DATA] as NormalBoxInternalData;
}
