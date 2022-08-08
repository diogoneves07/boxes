export interface NormalBoxEventObject<
  Box extends any,
  EventList extends string,
  AlternativesBoxTypes extends any
> {
  /** The name(type) of the event. */
  eventName: EventList & string;
  /** The data emitted through the event. */
  data: any | null;
  /** The box listening to the event. */
  box: Box;
  /** The box that triggered the event. */
  target: AlternativesBoxTypes;

  flag: "[normal]" | "[all]" | "[items]" | "[tree]";

  /** Removes event listener.*/
  off(): void;
}
