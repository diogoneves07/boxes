import { LISTENERS_STORE } from "./listeners-store";
import { NormalBox } from "./../types/normal-box";

// * This is just for a slight performance improvement.
const reusableArray: any[] = [];

export default function getChildrenForTreeEmit(
  box: NormalBox,
  eventName: string
): NormalBox[] | false {
  const globalEventList = LISTENERS_STORE.get(eventName);
  if (!globalEventList) {
    return false;
  }

  const contents = box.__data.contents;
  let values = contents as any[];

  if (!Array.isArray(values)) {
    reusableArray.push(contents);
    values = reusableArray;
  }

  let boxes: NormalBox[] | undefined;

  // * Use the array with the fewest items to loop.
  const objectToLoop =
    globalEventList.size < values.length ? globalEventList : values;

  const objectToSearch =
    objectToLoop === globalEventList ? new Set(values) : globalEventList;

  for (const value of objectToLoop) {
    if (value && value.isBox) {
      const boxChild = value as NormalBox;
      if (objectToSearch && objectToSearch.has(boxChild)) {
        if (!boxes) {
          boxes = [boxChild];
        } else {
          boxes.push(boxChild);
        }
      }
    }
  }

  reusableArray.length = 0;

  return boxes ? boxes : false;
}
