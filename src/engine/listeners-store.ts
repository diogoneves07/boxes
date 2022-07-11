import { NormalBox } from "./../types/normal-box";

export function addToListenersStore(box: NormalBox, eventName: string) {
  if (LISTENERS_STORE.has(eventName)) {
    LISTENERS_STORE.get(eventName)?.add(box);
  } else {
    const set = new Set<NormalBox>().add(box);
    LISTENERS_STORE.set(eventName, set);
  }
}
/**
 * A store that contains all event listeners that have already been added.
 *
 * * It is mainly useful for doing quick searches.
 *
 * */
export const LISTENERS_STORE: Map<string, Set<NormalBox>> = new Map();
