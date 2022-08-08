import { NormalBox } from "./../types/normal-box";
import getBoxInternalData from "./get-box-internal-data";

export default function forEachObserver(
  box: NormalBox,
  callbackfn: (boxObserver: NormalBox) => void | boolean
) {
  const o = getBoxInternalData(box).possibleObservers;

  if (!o || o.size === 0) return;

  for (const boxObserver of o) {
    if (callbackfn(boxObserver)) return;

    forEachObserver(boxObserver, callbackfn);
  }
}
