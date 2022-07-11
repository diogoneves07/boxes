import { LISTENERS_STORE } from "./listeners-store";
import { NormalBox } from "../types/normal-box";
import hasOwnProperty from "../utilities/hasOwnProperty";

export default function propagateToChildren(
  box: NormalBox,
  eventName: string,
  callbackfn: (box: NormalBox) => void
) {
  const globalEventList = LISTENERS_STORE.get(eventName);
  if (!globalEventList) {
    return;
  }

  const contents = box.__data.contents;
  const values = (Array.isArray(contents) ? contents : [contents]) as any[];

  // * Use the array with the fewest items to loop.
  const objectToLoop =
    globalEventList.size < values.length ? globalEventList : values;

  const objectToSearch =
    objectToLoop === globalEventList ? new Set(values) : globalEventList;

  for (const value of objectToLoop) {
    if (value && hasOwnProperty(value, "isBox") && value !== box) {
      const boxChild = value as NormalBox;
      if (objectToSearch && objectToSearch.has(boxChild)) {
        callbackfn(boxChild);
      }

      propagateToChildren(boxChild, eventName, callbackfn);
    }
  }
}
