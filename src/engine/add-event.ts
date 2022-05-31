import { addBoxToBroadcastList } from "./emit-events";
import { NormalBox } from "../types/normal-box";
import { EVENTS_PREFIX } from "../globals";

export function addEvent(box: NormalBox, type: string, callbackfn: Function) {
  if (!box.listeners) {
    box.listeners = {};
  }
  if (!box.listeners[type]) {
    box.listeners[type] = [];
  }
  box.listeners[type].push(callbackfn as any);

  if (type.substring(0, 1) === EVENTS_PREFIX.broadcast) {
    addBoxToBroadcastList(box);
  }
  box.emit("@eventAdded");
}
