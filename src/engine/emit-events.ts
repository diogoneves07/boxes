import { AnyBox } from "./../types/boxes";
import { NormalBox } from "../types/normal-box";
import { EmitEventConfig } from "../types/emit-event-config";
import CreateBoxEvent from "./create-box-event";
import forEachObserver from "./for-each-observer";
import getBoxInternalData from "./get-box-internal-data";
import removeBoxListener from "./remove-box-listener";
import {
  getFromGobalListenersStore,
  GLOBAL_LISTENERS_STORE,
} from "./global-listeners-store";
import { getFromGlobalEvent } from "./global-events";

function removeEvent(box: NormalBox, eventKey: string, callbackfn: Function) {
  removeBoxListener(box, eventKey, callbackfn);
}

export function emitEvents(
  box: AnyBox,
  eventKey: any,
  emitEventConfig?: () => EmitEventConfig | undefined,
  data: any = null
) {
  const forFns = (
    listenerCallbacks: Function[],
    mainBox: AnyBox,
    targetBox: AnyBox
  ) => {
    const boxEvent = CreateBoxEvent(mainBox, eventKey, data);

    const eventConfig = emitEventConfig && emitEventConfig();
    if (eventConfig) {
      Object.assign(boxEvent, eventConfig.props);
    }
    boxEvent.target = targetBox;

    const run = (callbackfn: Function) => {
      boxEvent.off = () => {
        removeEvent(mainBox, eventKey, callbackfn);
      };
      callbackfn.call(boxEvent, boxEvent);
    };

    listenerCallbacks.forEach(run);

    const globalListeners = getFromGlobalEvent(eventKey);

    if (globalListeners) {
      const boxEventGlobal = { ...boxEvent };
      boxEventGlobal.off = () => {};
      for (const fn of globalListeners) {
        fn(boxEventGlobal);
      }
    }
  };

  const boxListenerCallbacks = getFromGobalListenersStore(box, eventKey);

  boxListenerCallbacks && forFns(boxListenerCallbacks, box, box);

  /* const possibleObservers = getBoxInternalData(box).possibleObservers;

  if (possibleObservers && possibleObservers.size > 0) {
    forEachObserver(box, (boxObserver) => {
      const boxListenerCallbacks = getFromGobalListenersStore(
        boxObserver,
        eventKey,
        box.it
      );

      boxListenerCallbacks && forFns(boxListenerCallbacks, boxObserver, box);
    });
  }*/
}
