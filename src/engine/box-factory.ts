import { NormalBoxInternalData } from "./../types/normal-box-internal-data";
import { BOX_INTERNAL_DATA, IS_BOX } from "./boxes-symbols";
import { NormalBox } from "../types/normal-box";
import { emitEvents } from "./emit-events";
import { defineBoxParentsAndPossibleObservers } from "./parents-and-possible-observers";
import resetPropsLinkedData from "./reset-props-linked-data";
import getBoxInternalData from "./get-box-internal-data";
/** Unique id for each box */
let boxesId = 0;
const normalWrap = new Set<string>(["normal"]);
export function BoxFactory<BoxContent>(
  secret: boolean = false
): NormalBox<BoxContent> {
  const Box = ((...args: any) => {
    const data = getBoxInternalData(Box);
    const values = args.length === 1 ? args[0] : args;
    defineBoxParentsAndPossibleObservers(Box, values);

    emitEvents(Box, "@beforeAdd");
    emitEvents(Box, "@beforeChange");

    if (!data.contents) {
      data.contents =
        values === args[0] && Array.isArray(values) ? values.slice() : values;
    } else {
      if (!Array.isArray(data.contents)) {
        data.contents = [data.contents];
      }
      data.contents.push(...args);
    }

    resetPropsLinkedData(Box);

    emitEvents(Box, "@normalize");
    emitEvents(Box, "@added");
    emitEvents(Box, "@changed");
    return Box;
  }) as unknown as NormalBox;

  (Box as any)[BOX_INTERNAL_DATA] = {
    contents: null,
    notPointable: secret,
  } as NormalBoxInternalData;
  (Box as any)[IS_BOX] = true;

  (Box as any).id = ++boxesId;
  Box.wrappers = normalWrap;
  Box.parents = null;
  Box.itemsType = new Set();
  Box.hasBoxesReuse = true;

  return Box;
}
