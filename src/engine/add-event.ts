import { addBoxToBroadcastList } from "./emit-events";
import { NormalBox } from "../types/normal-box";
//
export function addEvent(box: NormalBox, type: string, callbackfn: Function) {
  if (typeof type === "string") {
    if (!box.listeners) {
      box.listeners = {};
    }
    if (!box.listeners[type]) {
      box.listeners[type] = [];
    }
    box.listeners[type].push(callbackfn as any);
  }
  if (type.substring(0, 1) === "*") {
    addBoxToBroadcastList(box);
  }
}
