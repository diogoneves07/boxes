import { LISTENERS_STORE } from "./listeners-store";
import { EVENTS_PREFIXES } from "../globals";
import { NormalBox, EmitEventConfig } from "../types/normal-box";
import { BROADCAST_STORE } from "./broadcast-store";
import createLinkAmoungRelatives from "./create-link-amoung-relatives";

function CreateBoxEvent(
  box: NormalBox,
  eventName: string,
  data: any | null = null,
  off: () => void,
  triggerBox: NormalBox
) {
  return {
    box,
    eventName,
    off,
    triggerBox,
    data,
  };
}
function removeEvent(box: NormalBox, eventName: string, callbackfn: Function) {
  box.off(eventName, callbackfn);
}

function emitToRelatives(eventName: string, box: NormalBox) {
  const treeEventName = `${eventName}[tree]`;
  const boxes = LISTENERS_STORE.get(treeEventName);

  if (boxes) {
    createLinkAmoungRelatives(box);

    const relatives = box.__data.relatives;

    if (relatives) {
      for (const relative of relatives) {
        if (boxes.has(relative)) {
          relative.emit(treeEventName, null, {
            props: { triggerBox: box },
          });
        }
      }
    }
  }
}
export function emitEvents(
  box: NormalBox,
  eventName: string,
  data: any = null,
  broadcastNextBox: NormalBox | null = null,
  emitEventConfig?: EmitEventConfig
) {
  if (!LISTENERS_STORE.has(eventName)) {
    emitToRelatives(eventName, box);
    return;
  }

  if (!broadcastNextBox) {
    const isBroadcastEvent =
      eventName.substring(0, 1) === EVENTS_PREFIXES.broadcast;

    if (isBroadcastEvent) {
      BROADCAST_STORE.forEach((boxes) => {
        boxes.forEach((nextBox) => {
          emitEvents(nextBox, eventName, data, box, emitEventConfig);
        });
      });
      return;
    }
  }

  const listeners = box.__data.listeners;

  const listenerSetOrCallback = listeners ? listeners.get(eventName) : false;

  if (!listenerSetOrCallback) {
    emitToRelatives(eventName, box);
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

    const callbackHack =
      (callbackfn as any).__boxesHackRealCallbackfn || callbackfn;

    callbackHack.call(boxEvent, boxEvent);
  };

  if (listenerSetOrCallback instanceof Set) {
    for (const fn of listenerSetOrCallback) {
      run(fn);
    }
  } else {
    run(listenerSetOrCallback);
  }
  emitToRelatives(eventName, box);
}
