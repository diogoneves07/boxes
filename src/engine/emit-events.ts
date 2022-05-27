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

function createBoxEvent(
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
  };
}

export function emitEvents(
  box: NormalBox,
  type: string,
  data: any = null,
  broadcastNextBox: NormalBox | null = null,
  emitEventConfig?: EmitEventConfig
) {
  const listenerBox = broadcastNextBox ? broadcastNextBox : box;
  const listeners = listenerBox.listeners;
  let willCleanlistenerArray: boolean = false;
  if (listeners && listeners[type]) {
    listeners[type].forEach((callbackfn, index, array) => {
      if (!callbackfn) return;

      let keepCallbackfn: boolean = true;

      const boxEvent = createBoxEvent(
        listenerBox,
        type,
        data,
        function removeEvent() {
          keepCallbackfn = false;
          if (type.substring(0, 1) === "*") {
            removeBoxFromBroadcastList(listenerBox);
          }
        },
        broadcastNextBox
      );

      if (emitEventConfig && emitEventConfig.props) {
        Object.assign(boxEvent, emitEventConfig.props);
      }

      callbackfn.call(boxEvent, boxEvent);
      if (!keepCallbackfn) {
        array[index] = null as any;
        willCleanlistenerArray = true;
      }
    });

    if (willCleanlistenerArray) {
      listeners[type] = listeners[type].filter((v) => v);
    }
  }
  if (!broadcastNextBox && type.substring(0, 1) === "*") {
    BOXES_WAITING_BROADCAST.forEach((broadcastNextBox) => {
      if (broadcastNextBox !== box) {
        emitEvents(box, type, broadcastNextBox, data, emitEventConfig);
      }
    });
  }
}
