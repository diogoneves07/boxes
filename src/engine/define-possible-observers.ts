import { NormalBox } from "../types/normal-box";
import hasOwnProperty from "../utilities/hasOwnProperty";

function addParent(boxChild: NormalBox, boxParent: NormalBox) {
  const data = boxChild.__data;

  if (data.possibleObservers) {
    data.possibleObservers.add(boxParent);
  } else {
    data.possibleObservers = new Set<NormalBox>().add(boxParent);
  }
}
function removeParent(boxChild: NormalBox, boxParent: NormalBox) {
  const data = boxChild.__data;

  if (data.possibleObservers) {
    data.possibleObservers.delete(boxParent);
  }
}
function possibleObservers(
  boxParent: NormalBox,
  contents: any,
  remove?: true
): any {
  if (Array.isArray(contents)) {
    for (const item of contents) {
      if (hasOwnProperty(item, "isBox")) {
        remove ? removeParent(item, boxParent) : addParent(item, boxParent);
      } else if (Array.isArray(item)) {
        possibleObservers(boxParent, item);
      }
    }
  }
  if (hasOwnProperty(contents, "isBox")) {
    remove ? removeParent(contents, boxParent) : addParent(contents, boxParent);
  }
  if (!boxParent.__data.possibleObservers) {
    boxParent.__data.possibleObservers = null;
  }
}

export function removePossibleOldObservers(box: NormalBox, contents: any) {
  possibleObservers(box, contents, true);
}

export default function definePossibleObservers(box: NormalBox, contents: any) {
  possibleObservers(box, contents);
}
