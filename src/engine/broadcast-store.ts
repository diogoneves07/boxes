import { NormalBox } from "./../types/normal-box";

/** A store for the boxes who are listening to broadcast events. */

export const BROADCAST_STORE: Map<string, Set<NormalBox>> = new Map();

export function removeBoxFromBroadcastStore(eventName: string, box: NormalBox) {
  const set = BROADCAST_STORE.get(eventName);
  if (set) {
    set.delete(box);
  }
}
export function addBoxToBroadcastStore(eventName: string, box: NormalBox) {
  const set = BROADCAST_STORE.get(eventName);
  if (set) {
    set.add(box);
  } else {
    BROADCAST_STORE.set(eventName, new Set<NormalBox>().add(box));
  }
}
