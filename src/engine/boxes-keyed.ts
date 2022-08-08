import { AnyBox } from "./../types/boxes";

export const BOXES_KEYED = new Map<any, AnyBox>();

export function getBoxByKey(key: any) {
  return BOXES_KEYED.get(key);
}

export function setBoxByKey(box: AnyBox, key: any) {
  BOXES_KEYED.set(key, box);
}
