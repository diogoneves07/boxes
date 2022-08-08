import { WrapEmit } from "./wrappers-emit";

export const lEmitNormalize = WrapEmit("@normalize");
export const lEmitBeforeChange = WrapEmit("@beforeChange");
export const lEmitChanged = WrapEmit("@changed");
export const lEmitSeted = WrapEmit("@seted");
export const lEmitBeforeAdd = WrapEmit("@beforeAdd");
export const lEmitAdded = WrapEmit("@added");
export const lEmitListenerAdded = WrapEmit("@listenerAdded");
export const lEmitListenerRemoved = WrapEmit("@listenerRemoved");
