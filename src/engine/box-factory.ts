import { NormalBox } from "../types/normal-box";
import isArray from "../utilities/is-array";
import { NormalBoxProps } from "./normal-box-props";
let count = 0;
export function BoxFactory<BoxContent>(): NormalBox<BoxContent> {
  const Box = function (...args: any) {
    const data = Box.__data;

    Box.emit("@beforeAdd");
    Box.emit("@beforeChange");
    if (!data.content) {
      data.content = args.length === 1 ? args[0] : args;
    } else {
      if (!isArray(data.content)) {
        data.content = [data.content];
      }
      data.content.push(...args);
    }

    Box.emit("@normalize");
    Box.emit("@added");
    Box.emit("@changed");
    data.cacheDataIntoBoxes = undefined;

    return Box;
  } as unknown as NormalBox;

  Object.assign(Box, NormalBoxProps, {
    __data: {
      content: null,
    },
    id: ++count,
  });
  return Box;
}
