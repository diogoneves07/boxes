import { NormalBox } from "../types/normal-box";
import isArray from "../utilities/is-array";
import { NormalBoxProps } from "./normal-box-props";
import resetCacheDataIntoBoxes from "./reset-cache-data-into-boxes";
/** Unique id for each box */
let boxesId = 0;

export function BoxFactory<BoxContent>(): NormalBox<BoxContent> {
  const Box = function (...args: any) {
    const data = Box.__data;

    // Box.emit("@beforeAdd");
    //  Box.emit("@beforeChange");
    if (!data.contents) {
      data.contents = args.length === 1 ? args[0] : args;
    } else {
      if (!isArray(data.contents)) {
        data.contents = [data.contents];
      }
      data.contents.push(...args);
    }
    resetCacheDataIntoBoxes(Box);

    Box.emit("@normalize");
    //Box.emit("@added");
    Box.emit("@changed");
    return Box;
  } as unknown as NormalBox;

  Object.assign(Box, NormalBoxProps, {
    __data: {
      contents: null,
    },
    id: ++boxesId,
  });
  return Box;
}
