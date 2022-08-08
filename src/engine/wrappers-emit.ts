import { EmitEventConfig } from "../types/emit-event-config";
import { Wrap } from "./wrapper";
import { emitEvents } from "./emit-events";

export function WrapEmit(eventKey: any) {
  return Wrap((box) => {
    return (data: any = null, props?: EmitEventConfig) => {
      emitEvents(box, eventKey, () => props, data);
    };
  });
}
