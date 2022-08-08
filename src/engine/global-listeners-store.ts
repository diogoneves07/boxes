import { NormalBoxProps } from "./normal-box-props";
import { AnyBox } from "./../types/boxes";

type ListenerObject = {
  callbackfn: Function;
  box: AnyBox;
  flag:
    | typeof NormalBoxProps.it
    | typeof NormalBoxProps.nodes
    | typeof NormalBoxProps.subtree
    | typeof NormalBoxProps.childs;
};
export const GLOBAL_LISTENERS_STORE: Map<any, ListenerObject[]> = new Map();

let currentEventFlag: ListenerObject["flag"] = NormalBoxProps.it;

function createListenerObject(box: AnyBox, callbackfn: Function) {
  return {
    flag: currentEventFlag,
    box,
    callbackfn,
  };
}
export function setCurrentEventFlag(fn: ListenerObject["flag"]) {
  currentEventFlag = fn;
}
export function addToGobalListenersStore(
  box: AnyBox,
  eventKey: any,
  callbackfn: Function
) {
  const eventKeyMap = GLOBAL_LISTENERS_STORE.get(eventKey);
  const listenerObject = createListenerObject(box, callbackfn);

  if (eventKeyMap) {
    eventKeyMap.push(listenerObject);
  } else {
    GLOBAL_LISTENERS_STORE.set(eventKey, [listenerObject]);
  }
}

export function getFromGobalListenersStore(
  box: AnyBox,
  eventKey: any,
  ignoreFlag?: ListenerObject["flag"]
) {
  const eventKeyMap = GLOBAL_LISTENERS_STORE.get(eventKey);

  if (eventKeyMap) {
    let fns: Function[] | undefined;
    for (const iterator of eventKeyMap) {
      if (iterator.box === box) {
        if (!ignoreFlag || iterator.flag !== ignoreFlag) {
          if (!fns) {
            fns = [];
          }
          fns.push(iterator.callbackfn);
        }
      }
    }

    return fns || false;
  }
  return false;
}

export function removeFromGobalListenersStore(
  box: AnyBox,
  eventKey: any,
  callbackfn: Function
) {
  const eventKeyMap = GLOBAL_LISTENERS_STORE.get(eventKey);
  if (eventKeyMap) {
    GLOBAL_LISTENERS_STORE.set(
      eventKey,
      eventKeyMap.filter((o) => o.box === box && o.callbackfn === callbackfn)
    );
    if (eventKeyMap.length === 0) {
      GLOBAL_LISTENERS_STORE.delete(eventKey);
    }
  }
}
