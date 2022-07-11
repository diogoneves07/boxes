import { LISTENERS_STORE } from "./listeners-store";
import { EVENTS_PREFIXES } from "../globals";
import { NormalBox, EmitEventConfig } from "../types/normal-box";

function CreateBoxEvent(
  box: NormalBox,
  eventName: string,
  data: any | null = null,
  off: () => void,
  triggerBox: NormalBox
) {
  let eventNameWithoutFlag = eventName;
  const flagInitIndex = eventNameWithoutFlag.indexOf("[");
  let flag = "[normal]";
  if (flagInitIndex > -1) {
    const splitFlag = eventNameWithoutFlag.split("[");
    eventNameWithoutFlag = splitFlag[0];
    flag = "[" + splitFlag[1];
  }
  return {
    box,
    eventName: eventNameWithoutFlag,
    off,
    flag,
    triggerBox,
    data,
  };
}
function removeEvent(box: NormalBox, eventName: string, callbackfn: Function) {
  box.off(eventName, callbackfn);
}

const OBSERVE_CHILDREN_FLAGS = ["tree", "nodes"];

function emitToFathers(eventName: string, box: NormalBox) {
  const possibleObservers = box.__data.possibleObservers;

  let emitConfig: Parameters<typeof box.emit>[2] = {
    props: { triggerBox: box },
  };

  box.emit(`${eventName}[tree]`, null, emitConfig);

  if (!possibleObservers || possibleObservers.size === 0) {
    return;
  }

  for (const flag of OBSERVE_CHILDREN_FLAGS) {
    const eventNameWithFlag = `${eventName}[${flag}]`;
    const boxes = LISTENERS_STORE.get(eventNameWithFlag);

    if (!boxes) continue;

    const loopPossibleObservers = (
      currentPossibleObservers: typeof possibleObservers
    ) => {
      for (const o of currentPossibleObservers) {
        if (o !== box && boxes.has(o)) {
          o.emit(eventNameWithFlag, null, emitConfig);
        }
        if (o.__data.possibleObservers && o.__data.possibleObservers.size) {
          loopPossibleObservers(o.__data.possibleObservers);
        }
      }
    };
    loopPossibleObservers(possibleObservers);
  }
}

function emitToAll(eventName: string, box: NormalBox) {
  const eventNameWithFlag = `${eventName}[all]`;
  const boxes = LISTENERS_STORE.get(eventNameWithFlag);

  if (!boxes) return;

  const emitConfig = {
    props: { triggerBox: box },
  };

  box.emit(eventNameWithFlag, null, emitConfig);

  for (const b of boxes) {
    if (b !== box) {
      b.emit(eventNameWithFlag, null, emitConfig);
    }
  }
}
export const CHECK_EVENT_RESULT_CACHE = new Map<string, any>();
function hasObserver(eventName: string) {
  if (eventName.includes("[")) {
    return false;
  }
  return (
    LISTENERS_STORE.has(`${eventName}[tree]`) ||
    LISTENERS_STORE.has(`${eventName}[nodes]`) ||
    LISTENERS_STORE.has(`${eventName}[all]`)
  );
}

export function emitEvents(
  box: NormalBox,
  eventName: string,
  data: any = null,
  broadcastNextBox: NormalBox | null = null,
  emitEventConfig?: EmitEventConfig
) {
  if (LISTENERS_STORE.size === 0) {
    return;
  }

  if (!LISTENERS_STORE.has(eventName)) {
    if (hasObserver(eventName)) {
      emitToAll(eventName, box);
      emitToFathers(eventName, box);
    }
    return;
  }

  if (
    !broadcastNextBox &&
    eventName.substring(0, 1) === EVENTS_PREFIXES.broadcast
  ) {
    LISTENERS_STORE.get(eventName)?.forEach((nextBox) => {
      emitEvents(nextBox, eventName, data, box, emitEventConfig);
    });
    return;
  }

  const listeners = box.__data.listeners;

  const listenerSetOrCallback = listeners ? listeners.get(eventName) : false;

  if (
    listenerSetOrCallback instanceof Set &&
    listenerSetOrCallback.size === 0
  ) {
    return;
  }

  if (!listenerSetOrCallback) {
    if (hasObserver(eventName)) {
      emitToAll(eventName, box);
      emitToFathers(eventName, box);
    }
    return;
  }

  const run = (callbackfn: Function) => {
    const boxEvent = CreateBoxEvent(
      box,
      eventName,
      data,
      () => {
        removeEvent(box, eventName, callbackfn);
      },
      broadcastNextBox || box
    );

    if (emitEventConfig && emitEventConfig.props) {
      Object.assign(boxEvent, emitEventConfig.props);
    }

    callbackfn.call(boxEvent, boxEvent);
  };

  if (listenerSetOrCallback instanceof Set) {
    for (const fn of listenerSetOrCallback) run(fn);
  } else {
    run(listenerSetOrCallback);
  }
  if (hasObserver(eventName)) {
    emitToAll(eventName, box);
    emitToFathers(eventName, box);
  }
}
