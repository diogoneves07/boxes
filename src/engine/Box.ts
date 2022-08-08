import { NormalBoxProps } from "./normal-box-props";
import { NormalBox } from "../types/normal-box";
import { BoxFactory } from "./box-factory";
import { changeLastBoxCreated } from "./get-boxes-pointed";
export default function Box<BoxContent = any>(
  ...args: any[]
): NormalBox<BoxContent> {
  const box = BoxFactory<BoxContent>();
  changeLastBoxCreated(box);
  Object.setPrototypeOf(box, NormalBoxProps);

  return args.length > 0 ? box(...args) : box;
}

export function SecretBox<BoxContent = any>(...args: any[]) {
  const box = BoxFactory<BoxContent>(true);
  Object.setPrototypeOf(box, NormalBoxProps);

  return args.length > 0 ? box(...args) : box;
}
