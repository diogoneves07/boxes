import { NormalBox, NormalBoxEventMap } from "./../types/normal-box";

function addListener(
  box: NormalBox,
  callbackfn: (BoxChanged: NormalBox) => void
) {
  function fn() {
    callbackfn(box);
  }
  box.on("@changed", fn);
  return fn;
}
function addListeners(
  box: NormalBox,
  callbackfn: (BoxChanged: NormalBox) => void,
  lastAllListeners?: Map<NormalBox, Function>
) {
  const contents = box.__data.contents;

  let allListeners: Map<NormalBox, Function> | undefined;

  const run = (value: any) => {
    if (value && value.isBox) {
      if (!allListeners) {
        allListeners = new Map();
      }
      if (lastAllListeners) {
        const previousCallbackfn = lastAllListeners.get(value);

        allListeners.set(
          value,
          previousCallbackfn || addListener(value, callbackfn)
        );

        if (previousCallbackfn) {
          lastAllListeners.delete(value);
        }
      } else {
        allListeners.set(value, addListener(value, callbackfn));
      }
    }
  };

  Array.isArray(contents) ? contents.forEach(run) : run(contents);

  return [allListeners, lastAllListeners];
}
export default function onChangeBoxesChildren(
  box: NormalBox,
  callbackfn: (BoxChanged: NormalBox) => void
): any {
  return;
  let allListeners = addListeners(box, callbackfn)[0] || new Map();

  const removeOnChangeBoxesChildren = () => {
    allListeners.forEach((item) => item());
    box.off("@listenerRemoved", checklistenerRemoved);
    box.off("@changed", changedBoxValues);
  };
  const checklistenerRemoved = (e: NormalBoxEventMap["@listenerRemoved"]) => {
    if (e.listenerRemoved.eventName === "@treeChanged") {
      removeOnChangeBoxesChildren();
    }
  };

  let waitingTimeout: boolean = false;
  const changedBoxValues = () => {
    if (!waitingTimeout) {
      setTimeout(() => {
        const values = addListeners(box, callbackfn, allListeners);
        allListeners = values[0] as any;

        if (values[1]) {
          values[1].forEach((item) => item());
        }

        waitingTimeout = false;
      }, 0);
      waitingTimeout = true;
    }
  };

  box.on("@listenerRemoved", checklistenerRemoved);
  box.on("@changed", changedBoxValues);
}
