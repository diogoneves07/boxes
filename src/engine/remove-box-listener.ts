import { AnyBox } from "./../types/boxes";
import { emitEvents } from "./emit-events";
import { removeFromGobalListenersStore } from "./global-listeners-store";
export default function removeBoxListener(
  box: AnyBox,
  eventKey: any,
  callbackfn: Function
) {
  removeFromGobalListenersStore(box, eventKey, callbackfn);

  if (eventKey !== "@listenerAdded" && eventKey !== "@listenerRemoved") {
    emitEvents(box, "@listenerRemoved", () => ({
      props: {
        removed: {
          name: eventKey,
          fn: callbackfn,
        },
      },
    }));
  }
}
