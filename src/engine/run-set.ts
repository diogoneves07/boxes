import { NormalBoxEventMap } from "./../types/normal-box-event-map";
import { NormalBox } from "./../types/normal-box";
import {
  defineBoxParentsAndPossibleObservers,
  removeOldParentsAndPossibleObservers,
} from "./parents-and-possible-observers";
import resetPropsLinkedData from "./reset-props-linked-data";
import getBoxInternalData from "./get-box-internal-data";
import { emitEvents } from "./emit-events";

/** Calls the listener callbackfn. */
export default function runSet(
  box: NormalBox,
  callbackfn: Function,
  e?: NormalBoxEventMap["*"]
) {
  const data = getBoxInternalData(box);
  const contents = data.contents;

  emitEvents(box, "@beforeSet");
  emitEvents(box, "@beforeChange");

  removeOldParentsAndPossibleObservers(box, data.contents);

  data.contents = e ? callbackfn(contents, e as any) : callbackfn(contents);

  defineBoxParentsAndPossibleObservers(box, data.contents);

  resetPropsLinkedData(box);

  emitEvents(box, "@normalize");
  emitEvents(box, "@seted");
  emitEvents(box, "@changed");
}
