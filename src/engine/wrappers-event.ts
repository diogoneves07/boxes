import { AnyBox } from "../types/boxes";
import { addBoxListener } from "./add-box-listener";
import { getCurrentBoxPointed } from "./get-boxes-pointed";
import isBox from "./is-box";
import removeBoxListener from "./remove-box-listener";
import { addToGlobalEvent, removeFromGlobalEvent } from "./global-events";

type Callbackfn<O = any> = (boxEvent: O) => void;
type DefaultBoxEvent = Parameters<Parameters<typeof addListeners>[2]>[0];

type CustomEventManager<BoxEvent, EventListenerOptions> = {
  on?: (
    box: AnyBox,
    eventKey: any,
    callbackfn: Callbackfn<BoxEvent>,
    eventListenerOptions?: EventListenerOptions
  ) => void;
  off?: (box: AnyBox, eventKey: any, callbackfn: Callbackfn<BoxEvent>) => {};
};

type CustomGlobalEventManager<BoxEvent, EventListenerOptions> = {
  on?: (
    eventKey: any,
    callbackfn: Callbackfn<BoxEvent>,
    eventListenerOptions?: EventListenerOptions
  ) => void;
  off?: (eventKey: any, callbackfn: Callbackfn<BoxEvent>) => {};
};

type RemoveWrapCallbackfn<Options extends any = undefined> = {
  (): void;

  eventKey: any;
  options?: Options;
  fn?: Callbackfn;
};

type AddWrapCallbackfn<O> = (
  callbackfn: (event: O) => void
) => RemoveWrapCallbackfn<undefined>;

function addListeners(
  boxes: AnyBox[],
  eventKey: any,
  callbackfn: Callbackfn,
  options: CustomEventManager<any, any> | undefined
) {
  for (const box of boxes) {
    if (isBox(box)) {
      addBoxListener(box, eventKey, callbackfn);
      if (options && options.on) {
        options.on(box, eventKey, callbackfn);
      }
    }
  }
}

function removeListeners(
  boxes: AnyBox[],
  eventKey: any,
  callbackfn: Callbackfn,
  options: CustomEventManager<any, any> | undefined
) {
  for (const box of boxes) {
    if (isBox(box)) {
      removeBoxListener(box, eventKey, callbackfn);
      if (options && options.off) {
        options.off(box, eventKey, callbackfn);
      }
    }
  }
}

function defineListener(
  boxes: AnyBox[],
  eventKey: any,
  options: CustomEventManager<any, any> | undefined
) {
  return (callbackfn: Callbackfn) => {
    addListeners(boxes, eventKey, callbackfn, options);

    return (() => {
      removeListeners(boxes, eventKey, callbackfn, options);
    }) as RemoveWrapCallbackfn;
  };
}

export function WrapEventFactory() {
  function wrapCallbacks<
    BoxEvent extends Record<string, any> = Record<string, any>,
    EventListenerOptions extends any = undefined
  >(
    eventKey: any,
    options?: CustomEventManager<DefaultBoxEvent, EventListenerOptions>
  ): {
    (...boxes: AnyBox[]): AddWrapCallbackfn<BoxEvent>;
    (box: AnyBox): AddWrapCallbackfn<BoxEvent>;
    (
      callbackfn: Callbackfn<BoxEvent>,
      eventListenerOptions?: EventListenerOptions
    ): RemoveWrapCallbackfn<EventListenerOptions>;
    (
      eventListenerOptions?: EventListenerOptions
    ): RemoveWrapCallbackfn<EventListenerOptions>;
  };

  function wrapCallbacks(
    eventKey: any,
    options?: CustomEventManager<DefaultBoxEvent, EventListenerOptions>
  ): {
    (...boxes: AnyBox[]): AddWrapCallbackfn<DefaultBoxEvent>;
    (box: AnyBox): AddWrapCallbackfn<DefaultBoxEvent>;
    (
      callbackfn: Callbackfn<DefaultBoxEvent>,
      eventListenerOptions?: EventListenerOptions
    ): RemoveWrapCallbackfn<EventListenerOptions>;
    (
      eventListenerOptions?: EventListenerOptions
    ): RemoveWrapCallbackfn<EventListenerOptions>;
  };

  function wrapCallbacks(
    eventKey: any,
    options?: CustomEventManager<DefaultBoxEvent, EventListenerOptions>
  ) {
    function eachWrapCallback(...boxes: AnyBox[]): Function;
    function eachWrapCallback(box: AnyBox): Function;
    function eachWrapCallback(callbackfn: Callbackfn): any;
    function eachWrapCallback(...callbackfnOrBoxes: (Callbackfn | AnyBox)[]) {
      let boxes: AnyBox[];
      const possibleEventCallback =
        callbackfnOrBoxes[0] as unknown as Callbackfn;

      if (isBox(possibleEventCallback)) {
        return defineListener(
          callbackfnOrBoxes as AnyBox[],
          eventKey,
          options
        ) as any;
      }

      const lastBoxCreated = getCurrentBoxPointed();
      if (lastBoxCreated) {
        boxes = [lastBoxCreated];

        addListeners(boxes, eventKey, possibleEventCallback, options);
      }

      return (() => {
        if (boxes) {
          removeListeners(
            boxes,
            eventKey,
            callbackfnOrBoxes[0] as unknown as Callbackfn,
            options
          );
        }
      }) as RemoveWrapCallbackfn;
    }
    return eachWrapCallback;
  }
  return wrapCallbacks;
}

export const WrapOn = WrapEventFactory();

export function GlobalEvents<
  BoxEvent extends Record<string, any> = DefaultBoxEvent,
  EventListenerOptions extends any = undefined
>(
  eventKey: any,
  options?: CustomGlobalEventManager<BoxEvent, EventListenerOptions>
) {
  return (
    callbackfn: Callbackfn<BoxEvent>,
    eventListenerOptions?: EventListenerOptions
  ) => {
    addToGlobalEvent(eventKey, callbackfn);
    if (options && options.on) {
      options.on(eventKey, callbackfn, eventListenerOptions);
    }

    return () => {
      removeFromGlobalEvent(eventKey, callbackfn);
      if (options && options.off) {
        options.off(eventKey, callbackfn);
      }
    };
  };
}
