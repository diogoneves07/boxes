import { NormalBox } from "./../types/normal-box";
export default function resetCacheDataIntoBoxes(box: NormalBox) {
  box.__data.cacheDataIntoBoxes = undefined;
}
