import { NormalBoxEvents } from "./normal-box-events";
import { NormalBoxEventObject } from "./normal-box-event";
import { NormalBox } from "./normal-box";

export type NormalBoxEvent = NormalBoxEventObject<
  NormalBox,
  keyof NormalBoxEventMap,
  NormalBox
>;
type AllEvents = {
  [K in NormalBoxEvents]: NormalBoxEvent;
};

export interface NormalBoxEventMap
  extends Omit<AllEvents, "@listenerAdded" | "@listenerAdded"> {
  "@beforeGet": NormalBoxEvent & {
    contents: ReturnType<NormalBox["get"]>;
  };
  "@listenerAdded": NormalBoxEvent & {
    /** An object with added event-related properties. */
    added: {
      /** The name(type) of the event. */
      name: keyof NormalBoxEventMap | string;
      /** The callbackfn. */
      fn: Function;
    };
  };

  "@listenerRemoved": NormalBoxEvent & {
    /** An object with removed event-related properties. */
    removed: {
      /** The name(type) of the event. */
      name: keyof NormalBoxEventMap | string;
      /** The callbackfn. */
      fn: Function;
    };
  };
  "*": NormalBoxEvent;
}
