import { CHECK_EVENT_RESULT_CACHE } from "./emit-events";
import { NormalBox } from "../types/normal-box";
import { addToListenersStore } from "./listeners-store";

export function addEvent(
  box: NormalBox,
  eventName: string,
  callbackfn: Function
) {
  CHECK_EVENT_RESULT_CACHE.delete(eventName);

  const data = box.__data;

  addToListenersStore(box, eventName);

  if (data.listeners) {
    const eventSetOrCallbackfn = data.listeners.get(eventName);

    if (eventSetOrCallbackfn) {
      if (eventSetOrCallbackfn instanceof Set) {
        eventSetOrCallbackfn.add(callbackfn);
      } else {
        data.listeners.set(
          eventName,
          new Set<Function>().add(eventSetOrCallbackfn).add(callbackfn)
        );
      }
    } else {
      data.listeners.set(eventName, callbackfn);
    }
  } else {
    data.listeners = new Map().set(eventName, callbackfn);
  }

  if (eventName !== "@listenerAdded" && eventName !== "@listenerRemoved") {
    box.emit("@listenerAdded", null, {
      props: {
        listenerAdded: {
          eventName,
          fn: callbackfn,
        },
      },
    });
  }
}
