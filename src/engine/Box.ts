import { NormalBox } from "../types/normal-box";
import { BoxFactory } from "./box-factory";
export default function Box<BoxContent = any>(
  ...args: any[]
): NormalBox<BoxContent> {
  const box = BoxFactory<BoxContent>();
  return args.length > 0 ? box(...args) : box;
}
