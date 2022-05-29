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
    const content = this.__data.content;
    this.emit("@beforeGet");
    return !isArray(content) && this.__data.isOriginalValueArray
      ? [content]
      : content;
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

      data.content = callbackfn(
        !isArray(content) && this.__data.isOriginalValueArray
          ? [content]
          : content,
        e
      );

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
      .split("_")
      .forEach((t) => {
        if (t) {
          addEvent(this, t, callbackfn);
        }
      });
    return this;
  },
  off(this: NormalBox, type: string, callbackfn: Function) {
    const listeners = this.listeners;
    if (!listeners) return this;
    type
      .trim()
      .split("_")
      .forEach((t) => {
        if (t) {
          if (listeners[t]) {
            const index = listeners[t].findIndex((c) => {
              if (
                c === callbackfn ||
                (c as any).originalCallbackfn === callbackfn
              ) {
                return true;
              }

              return;
            });

            if (index > -1) {
              listeners[t].splice(index, 1);
            }
          }
        }
      });

    return this;
  },
};
