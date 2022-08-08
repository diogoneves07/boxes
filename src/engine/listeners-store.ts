import { NormalBox } from "./../types/normal-box";

/**
 * A store that contains all event listeners that have already been added.
 *
 * * It is mainly useful for doing quick searches.
 *
 * */

export const LISTENERS_STORE: Map<string, Set<NormalBox>> = new Map();

let LISTENERS_STORE_LIST: string = "";

const listenerPrefix = "|";
export function addToListenersStore(box: NormalBox, eventName: string) {
  if (LISTENERS_STORE.has(eventName)) {
    LISTENERS_STORE.get(eventName)?.add(box);
  } else {
    const set = new Set<NormalBox>().add(box);
    LISTENERS_STORE.set(eventName, set);
    LISTENERS_STORE_LIST += listenerPrefix + eventName;
  }
}
export function deleteToListenersStore(box: NormalBox, eventName: string) {
  const l = LISTENERS_STORE.get(eventName);
  if (l) {
    l.delete(box);
    if (l.size === 0) {
      LISTENERS_STORE.delete(eventName);

      LISTENERS_STORE_LIST = LISTENERS_STORE_LIST.split(
        eventName + listenerPrefix
      ).join("");
    }
  }
}
export function hasListener(eventName: string) {
  return LISTENERS_STORE_LIST.includes(listenerPrefix + eventName);
}
