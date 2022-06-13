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
  get(this: NormalBox) {
    this.emit("@beforeGet");
    return this.__data.content;
  },

  set(
    this: NormalBox,
    callbackfn: (currentValue: any, event: NormalBoxEvent | undefined) => any,
    type?: string
  ) {
    const data = this.__data;
    const run = (e?: NormalBoxEvent) => {
      const content = data.content;

      this.emit("@beforeGet");
      this.emit("@beforeSet");
      this.emit("@beforeChange");

      data.content = callbackfn(content, e);

      this.emit("@normalize");
      this.emit("@seted");
      this.emit("@changed");
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
  normalize(this: NormalBox, callbackfn: (currentValue: any) => any) {
    this.emit("@beforeNormalize");
    const data = this.__data;
    data.content = callbackfn(data.content);
    this.emit("@normalized");
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
    return this;
  },

  change(this: NormalBox, ...newValues: any[]) {
    this.emit("@beforeChange");

    this.__data.content = newValues[1] ? newValues : newValues[0];
    this.emit("@normalize");
    this.emit("@changed");
    return this;
  },
  useDataIntoBoxes(this: NormalBox, ...ignoreBoxes: (NormalBox | string)[]) {
    return useDataIntoBoxes(this, ignoreBoxes);
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
        this.emit("@eventRemoved");
      }
    });

    return this;
  },
};
