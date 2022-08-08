import { NormalBox } from "./normal-box";
export type NormalBoxInternalData = {
  /** The contents of the box. */
  contents: any | null;
  /** Cache the value returned from @method getDataInBoxes().*/
  cacheDataIntoBoxes?: any;
  /** All box parents at all levels. */
  possibleObservers?: Set<NormalBox> | null;

  possibleObserversAdded?: boolean;

  parents?: null | NormalBox[];

  /** Listeners added to the box. */
  listeners?: Map<string, Function | Set<Function>>;

  notPointable: boolean;
};
