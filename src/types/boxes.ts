export interface Boxes<
  BoxContent extends any,
  EventMap extends Record<string, any>
> {
  /**  Push new values ​​to the box.*/
  (...newValues: BoxContent[]): this;

  /** The types of wrapper that wrap the box. */
  wrappers: Set<string>;

  parents: null | this[];

  itemsType: Set<string>;

  hasBoxesReuse: boolean;

  /** The unique identifier for each box. */
  readonly id: number;

  /**
   * Sets the new value for the box.
   * @param callbackfn
   * A callbackfn that takes the current value of the box and must return the new value.
   * @param eventName
   * Conditions the callbackfn to be invoked only after the event.
   */
  set(callbackfn: (currentValue: BoxContent) => BoxContent): this;

  set<C extends Function, K extends keyof EventMap>(
    callbackfn: (currentValue: BoxContent, event: EventMap[K]) => BoxContent,
    eventName: K
  ): this;

  set(
    callbackfn: (currentValue: BoxContent, event: EventMap["*"]) => BoxContent,
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
  normalize(callbackfn: (currentValue: BoxContent) => BoxContent): this;

  normalize(
    callbackfn: (currentValue: BoxContent, event: EventMap["*"]) => BoxContent,
    eventName: keyof EventMap
  ): this;

  normalize<C extends Function, K extends keyof EventMap>(
    callbackfn: (currentValue: BoxContent, event: EventMap[K]) => BoxContent,
    eventName: K
  ): this;

  normalize(
    callbackfn: (currentValue: BoxContent, event: EventMap["*"]) => BoxContent,
    eventName: string
  ): this;

  /** Gets the current value of the box. */
  get(): BoxContent;

  /** Changes the current value of the box. */
  new: (...newValue: BoxContent[]) => this;

  it<C extends (self: this) => unknown>(
    ...callbackfns: C[]
  ): ReturnType<C> extends void ? this : ReturnType<C>;

  nodes(...callbackfns: ((self: this) => void)[]): this;

  subtree(...callbackfns: ((self: this) => void)[]): this;

  childs(...callbackfns: ((self: this) => void)[]): this;

  key(key: any): this;
}

export type AnyBox = Boxes<any, any>;
