import { NormalBox } from "../types/normal-box";
import isArray from "../utilities/is-array";
import { NormalBoxProps } from "./normal-box-props";

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

    Box.emit("@added");
    Box.emit("@changed");
    return Box;
  } as unknown as NormalBox;
  const data: NormalBox["__data"] = {
    content: null,
  };
  Box.type = "normal";

  Object.assign(Box, NormalBoxProps, { __data: data });

  return Box;
}
