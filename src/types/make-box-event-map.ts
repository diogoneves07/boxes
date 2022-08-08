import { NormalBoxEventMap } from "./normal-box-event-map";

export default interface MakeEventMap<
  Box extends any,
  AlternativesBoxTypes extends any,
  DefaultBoxEvent extends any
> {
  [key: string]: DefaultBoxEvent;
  "@listenerAdded": DefaultBoxEvent & {
    /** An object with added event-related properties. */
    added: {
      /** The name(type) of the event. */
      name: keyof NormalBoxEventMap | string;
      /** The callbackfn. */
      fn: Function;
    };
  };

  "@listenerRemoved": DefaultBoxEvent & {
    /** An object with removed event-related properties. */
    removed: {
      /** The name(type) of the event. */
      name: keyof NormalBoxEventMap | string;
      /** The callbackfn. */
      fn: Function;
    };
  };
}
