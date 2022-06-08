type BoxesTypeConfig = {
  type: object;
  event: object;
  eventsList: string;
};
type NormalBoxConfig<BoxContent> = {
  type: NormalBox<BoxContent>;
  event: Required<NormalBoxEvent>;
  eventsList: NormalBoxEvents;
};
export type NormalBoxEvents =
  | "@beforeGet"
  | "@beforeSet"
  | "@seted"
  | "@beforeChange"
  | "@changed"
  | "@beforeAdd"
  | "@added"
  | "@eventAdded"
  | "@eventRemoved";

export type NormalBoxEvent<
  BoxTypeConfig extends BoxesTypeConfig = BoxesTypeConfig
> = {
  type: (keyof WindowEventMap | BoxTypeConfig["eventsList"] | String) & string;
  data: any | null;
  box: BoxTypeConfig["type"];
  broadcastBox: BoxTypeConfig["type"] | null;
  off(): void;
};

export type NormalBoxInternalData = {
  content: any | null;
};

export type EmitEventConfig = {
  props?: Record<string, any>;
};

export interface NormalBox<
  BoxContent = any,
  BoxTypeConfig extends BoxesTypeConfig = NormalBoxConfig<BoxContent>
> {
  (newValue: BoxContent): BoxTypeConfig["type"];
  (...newValues: BoxContent[]): BoxTypeConfig["type"];

  __data: NormalBoxInternalData;

  listeners?: Record<string, ((event: BoxTypeConfig["event"]) => void)[]>;

  type: string;

  isBox: true;

  set(callbackfn: (currentValue: any) => any): BoxTypeConfig["type"];

  set(
    callbackfn: (
      currentValue: any,
      event: BoxTypeConfig["event"] | undefined
    ) => any,
    type: BoxTypeConfig["eventsList"]
  ): BoxTypeConfig["type"];

  set(
    callbackfn: (
      currentValue: any,
      event: BoxTypeConfig["event"] | undefined
    ) => any,
    type: string
  ): BoxTypeConfig["type"];

  setIndex(...args: (number | unknown)[]): BoxTypeConfig["type"];

  get(): any;

  change(...newValue: any[]): BoxTypeConfig["type"];

  on(
    type: BoxTypeConfig["eventsList"],
    callbackfn: (
      this: BoxTypeConfig["event"],
      boxEvent: BoxTypeConfig["event"]
    ) => void
  ): BoxTypeConfig["type"];
  on(
    type: string,
    callbackfn: (
      this: BoxTypeConfig["event"],
      boxEvent: BoxTypeConfig["event"]
    ) => void
  ): BoxTypeConfig["type"];

  off(
    type: BoxTypeConfig["eventsList"],
    callbackfn: Function
  ): BoxTypeConfig["type"];

  off(type: string, callbackfn: Function): BoxTypeConfig["type"];

  emit(
    type: BoxTypeConfig["eventsList"],
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): BoxTypeConfig["type"];
  emit(
    type: string,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): BoxTypeConfig["type"];
  emit(
    type: String,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): BoxTypeConfig["type"];
}
