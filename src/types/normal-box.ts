import { NormalBoxEvents } from "./events";
export type BoxEvent<
  Box extends object = NormalBox,
  BoxEventMap extends Record<string, any> = NormalBoxEventMap
> = {
  /** The name(type) of the event. */
  eventName: keyof BoxEventMap | String;
  /** The data emitted through the event. */
  data: any | null;
  /** The box listening to the event. */
  box: Box;
  /** The box that triggered the event. */
  triggerBox: Box;
  /** Removes event listener.*/
  off(): void;
};

export type ListenerAddedBoxEvent<
  Box extends object = NormalBox,
  EventMap extends Record<string, any> = NormalBoxEventMap
> = BoxEventMap<Box>["*"] & {
  /** An object with added event-related properties. */
  listenerAdded: {
    /** The name(type) of the event. */
    eventName: keyof EventMap | String;
    /** The callbackfn. */
    fn: Function;
  };
};

export type ListenerRemovedBoxEvent<
  Box extends object = NormalBox,
  EventMap extends Record<string, any> = NormalBoxEventMap
> = BoxEventMap<Box>["*"] & {
  /** An object with removed event-related properties. */
  listenerRemoved: {
    /** The name(type) of the event. */
    eventName: keyof EventMap | String;
    /** The callbackfn. */
    fn: Function;
  };
};

export type NormalBoxInternalData = {
  /** The contents of the box. */
  contents: any | null;
  /** Cache the value returned from @method getDataInBoxes().*/
  cacheDataIntoBoxes?: any;
  /** All box parents at all levels. */
  relatives?: Set<NormalBox>;
  /** Listeners added to the box. */
  listeners?: Map<string, Function | Set<Function>>;
};

export type EmitEventConfig = {
  /** Properties that will be injected directly into the event object. */
  props?: Record<string, any>;
};

type AllEvents<Box extends object = NormalBox> = {
  [K in NormalBoxEvents]: BoxEvent<Box>;
};
export interface NormalBoxEventMap
  extends Omit<
    AllEvents,
    "@changed[tree]" | "@listenerAdded" | "@listenerAdded"
  > {
  "@changed[tree]": BoxEvent;

  "@listenerAdded": ListenerAddedBoxEvent;

  "@listenerRemoved": ListenerRemovedBoxEvent;
  "*": BoxEvent;
}
export interface BoxEventMap<
  Box extends object = NormalBox,
  EventMap extends Record<string, any> = NormalBoxEventMap
> extends Omit<
    AllEvents<Box>,
    "@changed[tree]" | "@listenerAdded" | "@listenerAdded"
  > {
  "@changed[tree]": BoxEvent<Box, EventMap>;

  "@listenerAdded": ListenerAddedBoxEvent<Box, EventMap>;

  "@listenerRemoved": ListenerRemovedBoxEvent<Box, EventMap>;
  "*": BoxEvent<Box, EventMap>;
}

export interface NormalBox<
  BoxContent = any,
  EventMap extends Record<string, any> = NormalBoxEventMap
> {
  /**  Adds new values ​​to the box.*/
  (...newValues: BoxContent[]): this;

  /**
   * The data necessary for the functioning of the library.
   * @protected
   * */
  __data: NormalBoxInternalData;

  /** The types of wrapper that wrap the box. */
  wrappers: Set<string>;

  /** Useful for checking if the function is a box.*/
  readonly isBox: true;

  /** The unique identifier for each box. */
  readonly id: number;

  /**
   * Sets the new value for the box.
   * @param callbackfn
   * A callbackfn that takes the current value of the box and must return the new value.
   * @param eventName
   * Conditions the callbackfn to be invoked only after the event.
   */
  set(callbackfn: (currentValue: any) => any): this;

  set(
    callbackfn: (currentValue: any, event: EventMap["*"]) => any,
    eventName: keyof EventMap
  ): this;

  set<C extends Function, K extends keyof EventMap>(
    callbackfn: (currentValue: any, event: EventMap[K]) => any,
    eventName: K
  ): this;

  set(
    callbackfn: (currentValue: any, event: EventMap["*"]) => any,
    eventName: string
  ): this;

  /**
   * Normalizes the box value.
   * @param callbackfn
   * A callbackfn that takes the current value of the box and must return the new value.
   * @param eventName
   * Conditions the callbackfn to be invoked only after the event.
   *
   * * This method is similar to the set() method, but it does not tigger the "@changed" event.
   */
  normalize(callbackfn: (currentValue: any) => any): this;

  normalize(
    callbackfn: (currentValue: any, event: EventMap["*"]) => any,
    eventName: keyof EventMap
  ): this;

  normalize<C extends Function, K extends keyof EventMap>(
    callbackfn: (currentValue: any, event: EventMap[K]) => any,
    eventName: K
  ): this;

  normalize(
    callbackfn: (currentValue: any, event: EventMap["*"]) => any,
    eventName: string
  ): this;

  /** Gets the current value of the box. */
  get(): any;

  /** Changes the current value of the box. */
  change(...newValue: any[]): this;

  /** Checks if a certain value exists in the box.*/
  has(value: any): boolean;

  /**
   * Gets the current value of the box by removing child boxes and keeping their values.
   * @param ignore
   * The boxes that should be kept in the return value.
   */
  getDataInBoxes(ignore?: NormalBox | string | (NormalBox | string)[]): any;

  /** Gets the listeners added to the box. */
  getListeners(): Map<string, Function | Set<Function>> | undefined;

  /**
   * Adds event listeners.
   * @param eventName
   * The name(type) of the event.
   * @param callbackfn
   * The callbackfn to invoke when the event tigger.
   */
  on<K extends Exclude<keyof EventMap, "*">>(
    eventName: K,
    callbackfn: (this: EventMap[K], boxEvent: EventMap[K]) => void
  ): this;

  on(
    eventName: keyof EventMap,
    callbackfn: (this: EventMap["*"], boxEvent: EventMap["*"]) => void
  ): this;

  on(
    eventName: string,
    callbackfn: (this: EventMap["*"], boxEvent: EventMap["*"]) => void
  ): this;

  /**
   * Removes event listeners.
   * @param eventName
   * The name(type) of the event.
   * @param callbackfn
   * The callbackfn used to listen for the event.
   */
  off(eventName: keyof EventMap, callbackfn: Function): this;

  off(eventName: string, callbackfn: Function): this;

  /**
   * Emits events.
   * @param eventName
   * The name(type) of the event.
   * @param data
   * The data that will be available through the "data" property of the event object.
   * @param emitEventConfig
   * Configures event emission.
   */
  emit(
    eventName: keyof EventMap,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): this;
  emit(eventName: string, data?: any, emitEventConfig?: EmitEventConfig): this;
  emit(eventName: String, data?: any, emitEventConfig?: EmitEventConfig): this;

  /**
   * Emits events through the box's child tree.
   * @param eventName
   * The name(type) of the event.
   * @param data
   * The data that will be available through the "data" property of the event object.
   * @param emitEventConfig
   * Configures event emission.
   */
  treeEmit(
    eventName: keyof EventMap,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): this;
  treeEmit(
    eventName: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): this;
  treeEmit(
    eventName: String,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): this;
}
