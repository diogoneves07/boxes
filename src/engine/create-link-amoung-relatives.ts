import { NormalBox } from "../types/normal-box";

function addParent(boxChild: NormalBox, boxParent: NormalBox) {
  const data = boxChild.__data;

  if (data.relatives) {
    data.relatives.add(boxParent);
  } else {
    data.relatives = new Set<NormalBox>().add(boxParent);
  }

  if (boxParent.__data.relatives) {
    for (const box of boxParent.__data.relatives) {
      data.relatives.add(box);
    }
  }
}
function addLinkAmoungRelatives(boxParent: NormalBox): any {
  const contents = boxParent.__data.contents;
  if (Array.isArray(contents)) {
    for (const item of contents) {
      if (item && item.isBox) {
        addParent(item, boxParent);
        addLinkAmoungRelatives(item);
      }
    }
  }
  if (contents && contents.isBox) {
    addParent(contents, boxParent);
    addLinkAmoungRelatives(contents);
  }
}

export default function createLinkAmoungRelatives(box: NormalBox) {
  addLinkAmoungRelatives(box);
}
