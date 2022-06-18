import { NormalBox, BoxEventMap } from "./../types/normal-box";
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
      setTimeout(() => {
        wapperCallbackfn();
      });
    }
  }
  box.on("@changed", fn);
  return fn;
}
function addListeners(
  box: NormalBox,
  wapperCallbackfn: WapperCallbackfn,
  lastAllListeners?: Map<NormalBox, Function>
) {
  const content = box.__data.content;

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
          previousCallbackfn || addListener(value, wapperCallbackfn)
        );

        if (previousCallbackfn) {
          lastAllListeners.delete(value);
        }
      } else {
        allListeners.set(value, addListener(value, wapperCallbackfn));
      }
    }
  };

  Array.isArray(content) ? content.forEach(run) : run(content);

  return [allListeners, lastAllListeners];
}
export default function onChangeBoxesChildren(
  box: NormalBox,
  callbackfn: (allBoxesChanged: Set<NormalBox>) => void
): any {
  const wapperCallbackfn: WapperCallbackfn = () => {
    const allBoxesChanged = wapperCallbackfn.allBoxesChanged;
    wapperCallbackfn.wasCall = false;
    wapperCallbackfn.allBoxesChanged = new Set();

    callbackfn(allBoxesChanged as Set<NormalBox>);
  };
  let allListeners = addListeners(box, wapperCallbackfn)[0];
  if (!allListeners) {
    return;
  }

  const removeOnChangeBoxesChildren = () => {
    allListeners?.forEach((item) => item());
    box.off("@listenerRemoved", checklistenerRemoved);
    box.off("@changed", changedBoxValues);
  };
  const checklistenerRemoved = (e: BoxEventMap["@listenerRemoved"]) => {
    if (e.listenerRemoved.type === "@deepChanges") {
      removeOnChangeBoxesChildren();
    }
  };
  let waitingTimeout: boolean = false;
  const changedBoxValues = () => {
    if (!waitingTimeout) {
      setTimeout(() => {
        const values = addListeners(box, wapperCallbackfn, allListeners);
        allListeners = values[0];

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
