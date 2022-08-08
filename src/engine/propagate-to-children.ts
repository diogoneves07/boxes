import { LISTENERS_STORE } from "./listeners-store";
import { NormalBox } from "../types/normal-box";
import forEachObserver from "./for-each-observer";
import getBoxInternalData from "./get-box-internal-data";
import isBox from "./is-box";

export default function propagateToChildren(
  box: NormalBox,
  eventName: string,
  callbackfn: (box: NormalBox) => void
) {
  const globalEventList = LISTENERS_STORE.get(eventName);
  if (!globalEventList) {
    return;
  }

  const contents = getBoxInternalData(box).contents;
  const values = (Array.isArray(contents) ? contents : [contents]) as any[];

  // * Use the array with the fewest items to loop.
  const objectToLoop =
    globalEventList.size < values.length ? globalEventList : values;

  const objectToSearch =
    objectToLoop === globalEventList ? new Set(values) : globalEventList;

  for (const value of objectToLoop) {
    if (value && isBox(value) && value !== box) {
      const boxChild = value as NormalBox;
      if (objectToSearch && objectToSearch.has(boxChild)) {
        callbackfn(boxChild);
      } else if (objectToLoop === globalEventList) {
        forEachObserver(boxChild, (boxObserver) => {
          if (boxObserver === box) {
            callbackfn(boxChild);
            return true;
          }
          return false;
        });
      } else {
        propagateToChildren(boxChild, eventName, callbackfn);
      }
    }
  }
}
