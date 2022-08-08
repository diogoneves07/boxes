import { AnyBox } from "../types/boxes";
import { getCurrentBoxPointed } from "./get-boxes-pointed";
import isBox from "./is-box";

export function Wrap<C extends (...args: any) => any>(
  callbackfn: (box: AnyBox) => C,
  lastBoxWrap?: string
) {
  type CallbackValue = ReturnType<C>;

  function wrapCallbacks(): CallbackValue;

  function wrapCallbacks(box: AnyBox): C;

  function wrapCallbacks(
    ...args: Parameters<ReturnType<typeof callbackfn>>
  ): CallbackValue;

  function wrapCallbacks(...boxesOrArgs: any[]) {
    let box: AnyBox | undefined = boxesOrArgs[0];

    if (isBox(box)) {
      return (...args: any[]) => {
        return callbackfn(box as AnyBox)(...args);
      };
    }

    box = getCurrentBoxPointed();

    if (!box) {
      throw new Error("Boxes: You must create a box before use this.");
    }

    if (lastBoxWrap && !box.wrappers.has(lastBoxWrap)) {
      throw new Error(
        "Boxes: This Wrap not works with this box type id: " + box.id + "."
      );
    }

    return callbackfn(box as AnyBox)(...boxesOrArgs);
  }

  return wrapCallbacks;
}
