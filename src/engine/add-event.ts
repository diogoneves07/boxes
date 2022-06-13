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
          hasChanged: (...ignoreBoxes: (NormalBox | string)[]) => {
            for (const iterator of ignoreBoxes) {
              let check: any = boxes.find((item) => {
                return item === iterator || item.type === iterator;
              });
              if (check) {
                return true;
              }
            }
            return false;
          },
        },
      });
    });
  }
  box.emit("@eventAdded");
}
