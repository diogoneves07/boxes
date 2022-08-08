import { NormalBox } from "../types/normal-box";
import getBoxInternalData from "./get-box-internal-data";
export default function resetPropsLinkedData(box: NormalBox) {
  const data = getBoxInternalData(box);
  data.cacheDataIntoBoxes = undefined;
  data.possibleObserversAdded = false;
}
