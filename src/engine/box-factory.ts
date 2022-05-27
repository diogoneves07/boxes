import { NormalBox } from "../types/normal-box";
import { NormalBoxProps } from "./normal-box-props";
import isArray from "../utilities/is-array";

export function BoxFactory<BoxContent>(): NormalBox<BoxContent> {
  const Box = function (args: any | any[]) {
    const data = Box.__data;

    Box.emit("@beforeAdd");
    Box.emit("@beforeChange");
    data.isOriginalValueArray = isArray(args);
    if (!data.content) {
      data.content = args;
    } else {
      data.content.push(...args);
    }

    Box.emit("@add");
    Box.emit("@change");
    return Box;
  } as unknown as NormalBox;
  const data: NormalBox["__data"] = {
    content: null,
  };
  Box.type = "normal";
  Object.assign(Box, NormalBoxProps, { __data: data });

  return Box;
}
