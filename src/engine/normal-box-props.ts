import {
  NormalBox,
  NormalBoxEvent,
  EmitEventConfig,
} from "../types/normal-box";
import isArray from "../utilities/is-array";
import { addEvent } from "./add-event";
import { emitEvents } from "./emit-events";
export const NormalBoxProps: Partial<NormalBox> = {
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

      this.emit("@set");
      this.emit("@change");
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
    this.set((values) => {
      const wasArray = isArray(values);
      const newValues = (wasArray ? values : [values]) as any[];
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

      return wasArray ? newValues : newValues[0];
    });
    return this;
  },

  change(this: NormalBox, newValue: any) {
    this.set(() => newValue);
    return this;
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
  on(
    this: NormalBox,
    type: string,
    callbackfn: (boxEvent: NormalBoxEvent) => void
  ) {
    type
      .trim()
      .split(" ")
      .forEach((t) => {
        const event = t.trim();
        if (event) {
          addEvent(this, event, callbackfn);
        }
      });
    return this;
  },
  off(this: NormalBox, type: string, callbackfn: Function) {
    const listeners = this.listeners;
    if (!listeners) return this;
    type
      .trim()
      .split(" ")
      .forEach((t) => {
        const event = t.trim();
        if (event) {
          if (listeners[event]) {
            const index = listeners[event].findIndex((c) => {
              if (
                c === callbackfn ||
                (c as any).originalCallbackfn === callbackfn
              ) {
                return true;
              }

              return;
            });

            if (index > -1) {
              listeners[event].splice(index, 1);
            }
          }
        }
      });

    return this;
  },
};
