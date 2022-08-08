import { NormalBox } from "../types/normal-box";
import getBoxInternalData from "./get-box-internal-data";
import isBox from "./is-box";

function addParent(boxChild: NormalBox, boxParent: NormalBox) {
  const data = getBoxInternalData(boxChild);

  if (data.possibleObservers) {
    data.possibleObservers.add(boxParent);
  } else {
    data.possibleObservers = new Set<NormalBox>().add(boxParent);
  }
  if (boxChild.parents) {
    boxChild.parents.push(boxParent);
    if (!boxParent.hasBoxesReuse) {
      boxParent.hasBoxesReuse = boxChild.parents.length > 1;
    }
  } else {
    boxChild.parents = [boxParent];
  }

  if (
    boxChild === boxParent ||
    (boxParent.parents && boxParent.parents.includes(boxChild))
  ) {
    throw (
      "Boxes: Circular reference. The boxes id: " +
      boxChild.id +
      " and " +
      boxParent.id +
      " cannot be at the same time child and parent of each other!"
    );
  }
}
function removeParent(boxChild: NormalBox, boxParent: NormalBox) {
  const data = getBoxInternalData(boxChild);

  if (data.possibleObservers) {
    data.possibleObservers.delete(boxParent);
  }
  if (boxChild.parents) {
    boxChild.parents = boxChild.parents.filter((item) => item !== boxParent);
  }
}
function possibleObservers(
  boxParent: NormalBox,
  contents: any,
  remove?: true
): any {
  if (Array.isArray(contents)) {
    for (const item of contents) {
      if (isBox(item)) {
        boxParent.itemsType.add("box");

        remove ? removeParent(item, boxParent) : addParent(item, boxParent);
      } else if (Array.isArray(item)) {
        possibleObservers(boxParent, item);
        boxParent.itemsType.add("array");
      } else {
        boxParent.itemsType.add(typeof item);
      }
    }
  }
  if (isBox(contents)) {
    boxParent.itemsType.add("box");

    remove ? removeParent(contents, boxParent) : addParent(contents, boxParent);
  } else {
    boxParent.itemsType.add(typeof contents);
  }
}

export function removeOldParentsAndPossibleObservers(
  box: NormalBox,
  contents: any
) {
  possibleObservers(box, contents, true);
}

export function defineBoxParentsAndPossibleObservers(
  box: NormalBox,
  contents: any
) {
  const data = getBoxInternalData(box);
  if (data.possibleObserversAdded) return;

  if (!data.possibleObserversAdded) {
    data.possibleObserversAdded = true;
  }
  switch (typeof contents) {
    case "object":
    case "function":
      box.itemsType.clear();
      box.hasBoxesReuse = false;

      possibleObservers(box, contents);
      break;
    default:
      box.itemsType.add(typeof contents);
      return;
  }
}
