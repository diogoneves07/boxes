import { NormalBox } from "../types/normal-box";
import { BoxFactory } from "./box-factory";
export function Box<BoxContent = any>(): NormalBox<BoxContent>;
export function Box<BoxContent = any>(amount: number): NormalBox<BoxContent>[];
export function Box<BoxContent = any>(amount?: number) {
  if (amount) {
    const boxes: NormalBox<BoxContent>[] = [];
    let count = 0;

    while (count < amount) {
      const box = BoxFactory<BoxContent>();
      box.type = "normal";
      boxes.push(box);

      count++;
    }
    return boxes;
  }

  return BoxFactory<BoxContent>();
}
