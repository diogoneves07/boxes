import { NormalBox } from "../types/normal-box";
import { emitEvents } from "./emit-events";
import { addToGobalListenersStore } from "./global-listeners-store";

export function addBoxListener(
  box: NormalBox,
  eventKey: any,
  callbackfn: Function
) {
  addToGobalListenersStore(box, eventKey, callbackfn);

  if (eventKey !== "@listenerAdded" && eventKey !== "@listenerRemoved") {
    emitEvents(box, "@listenerAdded", () => ({
      props: {
        added: {
          name: eventKey,
          fn: callbackfn,
        },
      },
    }));
  }
}
