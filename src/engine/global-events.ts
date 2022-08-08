const GLOBAL_EVENTS = new Map<any, Set<Function>>();

export function addToGlobalEvent(eventKey: any, callbackfn: Function) {
  const has = GLOBAL_EVENTS.get(eventKey);
  if (has) {
    has.add(callbackfn);
  } else {
    GLOBAL_EVENTS.set(eventKey, new Set<Function>().add(callbackfn));
  }
}

export function getFromGlobalEvent(eventKey: any) {
  return GLOBAL_EVENTS.get(eventKey);
}

export function removeFromGlobalEvent(eventKey: any, callbackfn: Function) {
  const has = GLOBAL_EVENTS.get(eventKey);
  if (has) {
    has.delete(callbackfn);
    if (has.size === 0) {
      GLOBAL_EVENTS.delete(eventKey);
    }
  }
}
