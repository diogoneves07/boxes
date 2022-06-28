import { NormalBox } from "../types/normal-box";
import { EVENTS_PREFIXES } from "../globals";
import { addBoxToBroadcastStore } from "./broadcast-store";
import { addToListenersStore } from "./listeners-store";

export function addEvent(
  box: NormalBox,
  eventName: string,
  callbackfn: Function
) {
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

  if (eventName.substring(0, 1) === EVENTS_PREFIXES.broadcast) {
    addBoxToBroadcastStore(eventName, box);
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
