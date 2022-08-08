import { AnyBox } from "../types/boxes";

let currentBoxPointed: AnyBox | undefined;
let isForcing = false;
let timeoutId = -1;
export function forceTemporaryCurrentBoxPointed(
  box: AnyBox,
  callbackfn: (self: AnyBox) => unknown
) {
  const keepCurrentBoxPointed = currentBoxPointed;
  const keepIsForcing = isForcing;

  currentBoxPointed = box;
  isForcing = true;

  let values = callbackfn(box);
  /*if (typeof values === "function") {
    values = values();
  }*/
  currentBoxPointed = keepCurrentBoxPointed;
  isForcing = keepIsForcing;

  return values === undefined ? box : values;
}

export function changeLastBoxCreated(box: AnyBox) {
  if (!isForcing) {
    currentBoxPointed = box;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (currentBoxPointed === box) {
        //* Removes reference not used! Avoiding memory leak.
        currentBoxPointed = undefined;
      }
    }, 0);
  }
}

export function getCurrentBoxPointed() {
  return currentBoxPointed;
}
