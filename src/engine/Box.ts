import { NormalBox } from "../types/normal-box";
import { BoxFactory } from "./box-factory";
function Box<BoxContent = any>(...args: any[]): NormalBox {
  const box = BoxFactory<BoxContent>();
  return args.length > 0 ? box(...args) : box;
}
export default Box;
