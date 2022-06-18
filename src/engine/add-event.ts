import { addBoxToBroadcastList } from "./emit-events";
import { NormalBox } from "../types/normal-box";
import { EVENTS_PREFIX } from "../globals";
import onChangeBoxesChildren from "./on-change-boxes-children";

export function addEvent(box: NormalBox, type: string, callbackfn: Function) {
  if (!box.listeners) {
    box.listeners = {};
  }
  if (!box.listeners[type]) {
    box.listeners[type] = new Set();
  }
  box.listeners[type].add(callbackfn as any);

  if (type.substring(0, 1) === EVENTS_PREFIX.broadcast) {
    addBoxToBroadcastList(box);
  } else if (type === "@deepChanges") {
    onChangeBoxesChildren(box, (allBoxesChanged: Set<NormalBox>) => {
      const boxes = [...allBoxesChanged];

      box.emit("@deepChanges", null, {
        props: {
          changedBoxes: boxes,
          onlyChanged: (check: NormalBox | string | (NormalBox | string)[]) => {
            const notIgnore = Array.isArray(check) ? check : [check];

            if (notIgnore.length > boxes.length) {
              return false;
            }

            for (const box of boxes) {
              if (!notIgnore.includes(box) && !notIgnore.includes(box.type)) {
                return false;
              }
            }

            return true;
          },
        },
      });
    });
  }
  if (type !== "@listenerAdded" && type !== "@listenerRemoved") {
    box.emit("@listenerAdded", null, {
      props: {
        listenerAdded: {
          type,
          fn: callbackfn,
        },
      },
    });
  }
}
