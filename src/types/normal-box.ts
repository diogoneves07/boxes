import { Boxes } from "./boxes";
import { NormalBoxEventMap } from "./normal-box-event-map";

export interface NormalBox<BoxContent extends any = any>
  extends Boxes<BoxContent, NormalBoxEventMap> {}
