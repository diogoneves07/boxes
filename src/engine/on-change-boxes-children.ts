import isArray from "../utilities/is-array";
import { NormalBox } from "./../types/normal-box";
import ignoreBoxes from "./ignore-boxes";
type WapperCallbackfn = {
  wasCall?: boolean;
  allBoxesChanged?: Set<NormalBox>;

  (): void;
};

function addListener(box: NormalBox, wapperCallbackfn: WapperCallbackfn) {
  function fn() {
    if (!wapperCallbackfn.allBoxesChanged) {
      wapperCallbackfn.allBoxesChanged = new Set();
    }
    wapperCallbackfn.allBoxesChanged.add(box);
    if (!wapperCallbackfn.wasCall) {
      wapperCallbackfn.wasCall = true;
      window.requestAnimationFrame(() => {
        wapperCallbackfn();
      });
    }
  }
  box.on("@changed", fn);
  return () => {
    box.off("@changed", fn);
  };
}
export default function onChangeBoxesChildren(
  box: NormalBox,
  callbackfn: (allBoxesChanged: Set<NormalBox>) => void,
  ignore?: string[]
): any {
  const content = box.__data.content;
  const allListeners: (() => void)[] = [];

  const wapperCallbackfn: WapperCallbackfn = () => {
    const allBoxesChanged = wapperCallbackfn.allBoxesChanged;
    wapperCallbackfn.wasCall = false;
    wapperCallbackfn.allBoxesChanged = new Set();

    callbackfn(allBoxesChanged as Set<NormalBox>);
  };

  const checkEventsRemoved = () => {
    if (
      box.listeners &&
      (!box.listeners["@deepChanges"] ||
        box.listeners["@deepChanges"].size === 0)
    ) {
      checkBoxChanges();
    }
  };
  const checkBoxChanges = () => {
    allListeners.forEach((item) => item());
    clearEvents();
    onChangeBoxesChildren(box, callbackfn, ignore);
  };

  const clearEvents = () => {
    box.off("@eventRemoved", checkEventsRemoved);
    box.off("@changed", checkBoxChanges);
  };

  box.on("@eventRemoved", checkEventsRemoved);
  box.on("@changed", checkBoxChanges);

  const checkfn: (value: any) => any = (value: any) => {
    if (ignoreBoxes(value, ignore)) {
      allListeners.push(addListener(value, wapperCallbackfn));

      const values = (value as NormalBox).__data.content;

      return isArray(values)
        ? onChangeBoxesChildren(values, wapperCallbackfn, ignore)
        : checkfn(values);
    }
  };

  (Array.isArray(content) ? content : [content]).forEach(checkfn);
}
