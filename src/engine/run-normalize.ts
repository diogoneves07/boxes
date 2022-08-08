import { NormalBoxEventMap } from "../main";
import { NormalBox } from "./../types/normal-box";
import { emitEvents } from "./emit-events";
import getBoxInternalData from "./get-box-internal-data";
import {
  defineBoxParentsAndPossibleObservers,
  removeOldParentsAndPossibleObservers,
} from "./parents-and-possible-observers";
import resetPropsLinkedData from "./reset-props-linked-data";
/** Calls the listener callbackfn. */
export default function runNormalize(
  box: NormalBox,
  callbackfn: Function,
  e?: NormalBoxEventMap["*"]
) {
  const data = getBoxInternalData(box);

  const contents = data.contents;
  removeOldParentsAndPossibleObservers(box, data.contents);
  data.contents = callbackfn(contents, e as any);
  defineBoxParentsAndPossibleObservers(box, data.contents);

  resetPropsLinkedData(box);

  emitEvents(box, "@normalized");
}
