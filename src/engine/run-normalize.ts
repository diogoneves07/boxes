import { BoxEventMap, NormalBox } from "./../types/normal-box";
import resetCacheDataIntoBoxes from "./reset-cache-data-into-boxes";
/** Calls the listener callbackfn. */
export default function runNormalize(
  box: NormalBox,
  callbackfn: Function,
  e?: BoxEventMap["*"]
) {
  const data = box.__data;

  const contents = data.contents;

  box.emit("@beforeNormalize");

  data.contents = callbackfn(contents, e as any);
  resetCacheDataIntoBoxes(box);

  box.emit("@normalized");
}
