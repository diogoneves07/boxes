import { EVENTS_PREFIX } from "./../globals";
import {
  NormalBox,
  NormalBoxEvent,
  EmitEventConfig,
} from "../types/normal-box";
import isArray from "../utilities/is-array";
import { addEvent } from "./add-event";
import { emitEvents, removeBoxFromBroadcastList } from "./emit-events";
import removeWhitespaces from "../utilities/remove-whitespaces";
import useDataIntoBoxes from "./use-data-into-boxes";
function splitWithSpace(type: string) {
  return removeWhitespaces(type).trim().split(" ");
}
export const NormalBoxProps: Partial<NormalBox> = {
  type: "normal",
  isBox: true,
  get(this: NormalBox) {
    this.emit("@beforeGet");
    return this.__data.content;
  },

  set(
    this: NormalBox,
    callbackfn: (currentValue: any, event: NormalBoxEvent) => any,
    type?: string
  ) {
    const data = this.__data;
    const run = (e?: NormalBoxEvent) => {
      const content = data.content;

      this.emit("@beforeSet");
      this.emit("@beforeChange");

      data.content = callbackfn(content, e as any);

      this.emit("@normalize");
      this.emit("@seted");
      this.emit("@changed");
      data.cacheDataIntoBoxes = undefined;
    };

    //! Gambiarra temporária
    run.originalCallbackfn = callbackfn;

    if (typeof type === "string") {
      addEvent(this, type, run);
    } else {
      run();
    }

    return this;
  },
  has(this: NormalBox, value: any) {
    const content = this.__data.content;
    if (Array.isArray(content)) {
      return content.includes(value);
    }
    return Object.is(content, value);
  },
  normalize(
    this: NormalBox,
    callbackfn: (currentValue: any, event: NormalBoxEvent) => any,
    type?: string
  ) {
    const data = this.__data;
    const run = (e?: NormalBoxEvent) => {
      const content = data.content;
      this.emit("@beforeNormalize");

      data.content = callbackfn(content, e as any);

      this.emit("@normalized");
      data.cacheDataIntoBoxes = undefined;
    };

    //! Gambiarra temporária
    run.originalCallbackfn = callbackfn;

    if (typeof type === "string") {
      addEvent(this, type, run);
    } else {
      run();
    }

    return this;
  },

  setIndex(this: NormalBox, ...args: (number & any)[]) {
    this.emit("@beforeSet");
    this.emit("@beforeChange");
    const content = this.__data.content;
    const wasArray = isArray(content);
    const newValues = (wasArray ? content : [content]) as any[];
    const length = newValues.length;
    let count = 1;
    while (args[count]) {
      if (args[count - 1] < length) {
        newValues[args[count - 1]] = args[count];
      } else {
        // TODO Adicinar um aviso de index maior que o número de elementos
      }
      count += 2;
    }

    this.__data.content =
      wasArray || newValues.length > 1 ? newValues : newValues[0];

    this.emit("@normalize");
    this.emit("@seted");
    this.emit("@changed");
    this.__data.cacheDataIntoBoxes = undefined;

    return this;
  },

  change(this: NormalBox, ...newValues: any[]) {
    this.emit("@beforeChange");

    this.__data.content = newValues[1] ? newValues : newValues[0];
    this.emit("@normalize");
    this.emit("@changed");
    this.__data.cacheDataIntoBoxes = undefined;

    return this;
  },
  getDataIntoBoxes(
    this: NormalBox,
    ignoreBoxes?: NormalBox | string | (NormalBox | string)[]
  ) {
    if (this.__data.cacheDataIntoBoxes) {
      return this.__data.cacheDataIntoBoxes;
    }
    const value = useDataIntoBoxes(
      this.__data.content,
      ignoreBoxes
        ? Array.isArray(ignoreBoxes)
          ? ignoreBoxes
          : [ignoreBoxes]
        : undefined
    );
    this.__data.cacheDataIntoBoxes = value;
    return value;
  },

  emit(
    this: NormalBox,
    type: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ) {
    emitEvents(this, type, data, null, emitEventConfig);
    return this;
  },
  on(this: NormalBox, type: string, callbackfn: (boxEvent: any) => void) {
    splitWithSpace(type).forEach((t) => {
      const eventName = t;
      if (eventName) {
        addEvent(this, eventName, callbackfn);
      }
    });
    return this;
  },
  off(this: NormalBox, type: string, callbackfn: Function) {
    const listeners = this.listeners;
    if (!listeners) return this;
    splitWithSpace(type).forEach((t) => {
      const eventName = t;
      if (!listeners[eventName]) {
        return;
      }
      const fn = [...listeners[eventName]].find(
        (c) => c === callbackfn || (c as any).originalCallbackfn === callbackfn
      );

      if (fn) {
        if (eventName.substring(0, 1) === EVENTS_PREFIX.broadcast) {
          removeBoxFromBroadcastList(this);
        }
        listeners[eventName].delete((fn as any).originalCallbackfn || fn);
        if (
          eventName !== "@listenerAdded" &&
          eventName !== "@listenerRemoved"
        ) {
          this.emit("@listenerRemoved", null, {
            props: {
              listenerRemoved: {
                type: eventName,
                fn: (fn as any).originalCallbackfn || fn,
              },
            },
          });
        }
      }
    });

    return this;
  },
};
