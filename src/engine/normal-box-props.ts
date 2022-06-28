import { LISTENERS_STORE } from "./listeners-store";
import { EVENTS_PREFIXES } from "./../globals";
import { NormalBox, BoxEventMap, EmitEventConfig } from "../types/normal-box";
import { addEvent } from "./add-event";
import { emitEvents } from "./emit-events";
import removeWhitespaces from "../utilities/remove-whitespaces";
import useDataIntoBoxes from "./use-data-into-boxes";
import runSet from "./run-set";
import runNormalize from "./run-normalize";
import { removeBoxFromBroadcastStore } from "./broadcast-store";
import getChildrenForTreeEmit from "./get-children-for-tree-emit";
import resetCacheDataIntoBoxes from "./reset-cache-data-into-boxes";

function splitWithSpace(eventName: string) {
  return removeWhitespaces(eventName).trim().split(" ");
}

const normalWrapper = new Set<string>().add("normal");

export const NormalBoxProps: Partial<NormalBox> = {
  wrappers: normalWrapper,
  isBox: true,
  get(this: NormalBox) {
    return this.__data.contents;
  },

  set(
    this: NormalBox,
    callbackfn: (currentValue: any, event: BoxEventMap["*"]) => any,
    eventName?: string
  ) {
    if (typeof eventName === "string") {
      addEvent(this, eventName, (e: any) => {
        runSet(this, callbackfn, e);
      });
    } else {
      runSet(this, callbackfn);
    }

    return this;
  },

  normalize(
    this: NormalBox,
    callbackfn: (currentValue: any, event: BoxEventMap["*"]) => any,
    eventName?: string
  ) {
    if (typeof eventName === "string") {
      addEvent(this, eventName, (e: any) => {
        runNormalize(this, callbackfn, e);
      });
    } else {
      runNormalize(this, callbackfn);
    }

    return this;
  },

  change(this: NormalBox, ...newValues: any[]) {
    this.emit("@beforeChange");

    this.__data.contents = newValues[1] ? newValues : newValues[0];
    resetCacheDataIntoBoxes(this);

    this.emit("@normalize");
    this.emit("@changed");

    return this;
  },
  has(this: NormalBox, value: any) {
    const contents = this.__data.contents;
    if (Array.isArray(contents)) {
      return new Set(contents).has(value);
    }
    return Object.is(contents, value);
  },
  getDataInBoxes(
    this: NormalBox,
    ignore?: NormalBox | string | (NormalBox | string)[]
  ) {
    const value = useDataIntoBoxes(
      this.__data.contents,
      ignore ? (Array.isArray(ignore) ? ignore : [ignore]) : undefined
    );
    this.__data.cacheDataIntoBoxes = value;
    return value;
  },
  getListeners(this: NormalBox) {
    return this.__data.listeners;
  },
  emit(
    this: NormalBox,
    eventName: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ) {
    emitEvents(this, eventName, data, null, emitEventConfig);
    return this;
  },

  treeEmit(
    this: NormalBox,
    eventName: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ) {
    const boxes = getChildrenForTreeEmit(this, eventName);

    if (boxes) {
      for (const box of boxes) {
        box.emit(eventName, data, emitEventConfig);
        box.treeEmit(eventName, data, emitEventConfig);
      }
    }

    return this;
  },

  on(this: NormalBox, eventName: string, callbackfn: (boxEvent: any) => void) {
    splitWithSpace(eventName).forEach((t) => {
      const eventName = t;
      if (eventName) {
        addEvent(this, eventName, callbackfn);
      }
    });
    return this;
  },

  off(this: NormalBox, eventName: string, callbackfn: Function) {
    splitWithSpace(eventName).forEach((t) => {
      const eventName = t;
      const listeners = this.__data.listeners;

      if (!listeners) {
        return;
      }

      const listenerSetOrCallback = listeners.get(eventName);
      if (!listenerSetOrCallback) {
        return;
      }
      if (
        listenerSetOrCallback instanceof Set &&
        listenerSetOrCallback.has(callbackfn)
      ) {
        listenerSetOrCallback.delete(callbackfn);
        if (listenerSetOrCallback.size === 0) {
          LISTENERS_STORE.delete(eventName);
        }
      } else if (listenerSetOrCallback === callbackfn) {
        listeners.delete(eventName);
        LISTENERS_STORE.delete(eventName);
      } else {
        return;
      }

      if (eventName.substring(0, 1) === EVENTS_PREFIXES.broadcast) {
        removeBoxFromBroadcastStore(eventName, this);
      }

      if (eventName !== "@listenerAdded" && eventName !== "@listenerRemoved") {
        this.emit("@listenerRemoved", null, {
          props: {
            listenerRemoved: {
              eventName: eventName,
              fn: callbackfn,
            },
          },
        });
      }
    });

    return this;
  },
};
