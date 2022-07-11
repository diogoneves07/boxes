import { NormalBox, BoxEventMap } from "./../types/normal-box";
import definePossibleObservers, {
  removePossibleOldObservers,
} from "./define-possible-observers";
import resetCacheDataIntoBoxes from "./reset-cache-data-into-boxes";
/** Calls the listener callbackfn. */
export default function runSet(
  box: NormalBox,
  callbackfn: Function,
  e?: BoxEventMap["*"]
) {
  const data = box.__data;
  const contents = data.contents;

  box.emit("@beforeSet");
  box.emit("@beforeChange");

  removePossibleOldObservers(box, data.contents);

  data.contents = e ? callbackfn(contents, e as any) : callbackfn(contents);

  definePossibleObservers(box, data.contents);

  resetCacheDataIntoBoxes(box);
  box.emit("@normalize");
  box.emit("@seted");
  box.emit("@changed");
}
