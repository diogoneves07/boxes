import { NormalBox } from "../types/normal-box";
import definePossibleObservers from "./define-possible-observers";
import { emitEvents } from "./emit-events";
import { NormalBoxProps } from "./normal-box-props";
import resetCacheDataIntoBoxes from "./reset-cache-data-into-boxes";
/** Unique id for each box */
let boxesId = 0;

const normalWrapper = new Set<string>().add("normal");
export function BoxFactory<BoxContent>(): NormalBox<BoxContent> {
  const Box = ((...args: any) => {
    const data = Box.__data;

    emitEvents(Box, "@beforeAdd");
    emitEvents(Box, "@beforeChange");

    const values = args.length === 1 ? args[0] : args;

    if (!data.contents) {
      data.contents =
        values === args[0] && Array.isArray(values) ? values.slice() : values;
    } else {
      if (!Array.isArray(data.contents)) {
        data.contents = [data.contents];
      }
      data.contents.push(...args);
    }

    definePossibleObservers(Box, values);
    resetCacheDataIntoBoxes(Box);

    emitEvents(Box, "@normalize");
    emitEvents(Box, "@added");
    emitEvents(Box, "@changed");

    return Box;
  }) as unknown as NormalBox;

  Object.setPrototypeOf(Box, NormalBoxProps);

  Box.__data = {
    contents: null,
  };

  (Box as any).id = ++boxesId;
  (Box as any).isBox = true;
  Box.wrappers = normalWrapper;

  return Box;
}
