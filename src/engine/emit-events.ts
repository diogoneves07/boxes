import { EVENTS_PREFIX } from "../globals";
import { NormalBox, EmitEventConfig } from "../types/normal-box";

const BOXES_WAITING_BROADCAST: NormalBox[] = [];

export function removeBoxFromBroadcastList(box: NormalBox) {
  const index = BOXES_WAITING_BROADCAST.indexOf(box);

  if (index >= 0) {
    BOXES_WAITING_BROADCAST.splice(index, 1);
  }
}

export function addBoxToBroadcastList(box: NormalBox) {
  BOXES_WAITING_BROADCAST.push(box);
}

function CreateBoxEvent(
  box: NormalBox,
  type: string,
  data: any | null = null,
  off: () => void,
  broadcastBox: NormalBox | null = null
) {
  return {
    box,
    type,
    off,
    broadcastBox,
    data,

    // This method always comes from EmitEventConfig
    hasChanged: null,

    changedBoxes: null,
  };
}

export function emitEvents(
  box: NormalBox,
  type: string,
  data: any = null,
  broadcastNextBox: NormalBox | null = null,
  emitEventConfig?: EmitEventConfig
) {
  const listeners = box.listeners;

  const isBroadcastEvent = type.substring(0, 1) === EVENTS_PREFIX.broadcast;
  if (!broadcastNextBox && isBroadcastEvent) {
    BOXES_WAITING_BROADCAST.forEach((nextBox) => {
      emitEvents(nextBox, type, data, box, emitEventConfig);
    });
    return;
  }

  if (!listeners || !listeners[type]) {
    return;
  }

  [...new Set(listeners[type])].forEach((callbackfn) => {
    let removeCallbackfn: boolean = false;

    const boxEvent = CreateBoxEvent(
      box,
      type,
      data,
      function removeEvent() {
        removeCallbackfn = true;
        if (isBroadcastEvent) {
          removeBoxFromBroadcastList(box);
        }
        box.emit("@eventRemoved");
      },
      broadcastNextBox
    );

    if (emitEventConfig && emitEventConfig.props) {
      Object.assign(boxEvent, emitEventConfig.props);
    }

    callbackfn.call(boxEvent, boxEvent);
    removeCallbackfn && listeners[type].delete(callbackfn);
  });
}
