import { NormalBox } from "../types/normal-box";
import { BoxFactory } from "./box-factory";
function Box<BoxContent = any>(...args: any[]): NormalBox {
  const box = BoxFactory<BoxContent>();
  return args.length > 0 ? box(...args) : box;
}
Box.hasBoxes = (values: any, ignoreBoxes?: string | string[]) => {
  const boxesType = Array.isArray(ignoreBoxes) ? ignoreBoxes : [ignoreBoxes];
  let value =
    values && (values as NormalBox).isBox
      ? Array.isArray(values.get())
        ? values.get()
        : [values.get()]
      : values;

  if (value && Array.isArray(value)) {
    return value.find((item) => {
      return (
        item &&
        !boxesType.includes(item) &&
        !boxesType.includes(item.type) &&
        item.isBox
      );
    })
      ? true
      : false;
  }
  return false;
};

export default Box;
