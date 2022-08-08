import { NormalBoxProps } from "./normal-box-props";
import { NormalBox } from "../types/normal-box";
import { BoxFactory } from "./box-factory";
import { changeLastBoxCreated } from "./get-boxes-pointed";

const prototypesCreated = new Map<string, object>();
export default function CreateBoxType<BoxContent>(
  type: string,
  prototype: object,
  wrappers: Set<string>
): NormalBox<BoxContent> {
  const box = BoxFactory<BoxContent>();

  const reusePrototype = prototypesCreated.get(type);

  if (reusePrototype) {
    Object.setPrototypeOf(box, reusePrototype);
  } else {
    const newPrototype = { ...NormalBoxProps, ...prototype };
    prototypesCreated.set(type, newPrototype);
    Object.setPrototypeOf(box, newPrototype);
  }

  box.wrappers = wrappers;

  changeLastBoxCreated(box);

  return box;
}
