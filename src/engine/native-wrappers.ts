import { AnyBox } from "./../types/boxes";
import getBoxInternalData from "./get-box-internal-data";
import useDataIntoBoxes from "./use-data-into-boxes";

import { Wrap } from "./wrapper";

/*
  const Counter = () => _button(0).set((v) => ++v, lOnClick);
  lNormalizeBoxItems(()=>{}, lClick);
*/

/** Checks if a certain value exists in the box.*/

export const lHasValueInBox = Wrap((box) => (value: any) => {
  const contents = getBoxInternalData(box).contents;
  if (Array.isArray(contents)) {
    return new Set(contents).has(value);
  }
  return Object.is(contents, value);
});

/**
 * Gets the current value of the box by removing child boxes and keeping their values.
 * @param ignore
 * The boxes that should be kept in the return value.
 */
export const lGetDataInBoxes = Wrap(
  (box) => (ignore?: AnyBox | string | (AnyBox | string)[]) => {
    const value = useDataIntoBoxes(
      getBoxInternalData(box).contents,
      ignore ? (Array.isArray(ignore) ? ignore : [ignore]) : undefined
    );
    getBoxInternalData(box).cacheDataIntoBoxes = value;
    return value;
  }
);

/** Gets the listeners added to the box. */
export const lGetListeners = Wrap((box) => () => {
  return getBoxInternalData(box).listeners;
});
