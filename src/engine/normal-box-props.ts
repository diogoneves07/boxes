import { FLAGS } from "./../globals";
import { LISTENERS_STORE } from "./listeners-store";
import { NormalBox, BoxEventMap, EmitEventConfig } from "../types/normal-box";
import { addEvent } from "./add-event";
import { emitEvents } from "./emit-events";
import removeWhitespaces from "../utilities/remove-whitespaces";
import useDataIntoBoxes from "./use-data-into-boxes";
import runSet from "./run-set";
import runNormalize from "./run-normalize";
import resetCacheDataIntoBoxes from "./reset-cache-data-into-boxes";
import definePossibleObservers, {
  removePossibleOldObservers,
} from "./define-possible-observers";
import propagateToChildren from "./propagate-to-children";

function forEachEventName(
  eventName: string,
  callbackfn: (eventName: string) => void
) {
  if (!eventName) return;

  if (!eventName.includes(" ")) return callbackfn(eventName);

  for (const e of removeWhitespaces(eventName).trim().split(" ")) {
    e !== "" && callbackfn(e);
  }
}

export const NormalBoxProps: Partial<NormalBox> = {
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

  new(this: NormalBox, ...newValues: any[]) {
    this.emit("@beforeChange");

    removePossibleOldObservers(this, this.__data.contents);

    this.__data.contents = newValues[1] ? newValues : newValues[0];
    definePossibleObservers(this, this.__data.contents);

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
    forEachEventName(eventName, (t) => {
      emitEvents(this, t, data, null, emitEventConfig);
    });
    return this;
  },

  treeEmit(
    this: NormalBox,
    eventName: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ) {
    this.emit(eventName, data, emitEventConfig);

    forEachEventName(eventName, (t) => {
      propagateToChildren(this, t, (box) => {
        box.emit(t, data, emitEventConfig);
      });
    });

    return this;
  },
  nodesEmit(
    this: NormalBox,
    eventName: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ) {
    forEachEventName(eventName, (t) => {
      propagateToChildren(this, t, (box) => {
        box.emit(t, data, emitEventConfig);
      });
    });

    return this;
  },
  allEmit(
    this: NormalBox,
    eventName: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ) {
    this.emit(eventName, data, emitEventConfig);
    forEachEventName(eventName, (t) => {
      const boxes = LISTENERS_STORE.get(t);
      if (boxes) {
        for (const box of boxes) {
          if (box !== this) {
            box.emit(t, data, emitEventConfig);
          }
        }
      }
    });

    return this;
  },

  on(this: NormalBox, eventName: string, callbackfn: (boxEvent: any) => void) {
    forEachEventName(eventName, (t) => {
      addEvent(this, t, callbackfn);
    });
    return this;
  },

  treeOn(
    this: NormalBox,
    eventName: string,
    callbackfn: (boxEvent: any) => void
  ) {
    forEachEventName(eventName, (t) => {
      addEvent(this, t + FLAGS.tree, callbackfn);
    });
    return this;
  },

  nodesOn(
    this: NormalBox,
    eventName: string,
    callbackfn: (boxEvent: any) => void
  ) {
    forEachEventName(eventName, (t) => {
      addEvent(this, t + FLAGS.nodes, callbackfn);
    });
    return this;
  },

  allOn(
    this: NormalBox,
    eventName: string,
    callbackfn: (boxEvent: any) => void
  ) {
    forEachEventName(eventName, (t) => {
      addEvent(this, t + FLAGS.all, callbackfn);
    });
    return this;
  },

  off(this: NormalBox, eventName: string, callbackfn: Function) {
    forEachEventName(eventName, (t) => {
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

  treeOff(this: NormalBox, eventName: string, callbackfn: Function) {
    forEachEventName(eventName, (t) => {
      this.off(t + FLAGS.tree, callbackfn);
    });
    return this;
  },
  nodesOff(this: NormalBox, eventName: string, callbackfn: Function) {
    forEachEventName(eventName, (t) => {
      this.off(t + FLAGS.nodes, callbackfn);
    });
    return this;
  },
  allOff(this: NormalBox, eventName: string, callbackfn: Function) {
    forEachEventName(eventName, (t) => {
      this.off(t + FLAGS.all, callbackfn);
    });
    return this;
  },
};
