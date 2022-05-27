// Events... lib: @any, broadcast: *, users: &any,

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
  | "@set"
  | "@beforeChange"
  | "@change"
  | "@beforeAdd"
  | "@add"
  | "@listenersChange";

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
  isOriginalValueArray?: boolean;
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

  listeners: Record<string, ((event: BoxTypeConfig["event"]) => void)[]>;
  type: string;

  set(
    callbackfn: (
      currentValue: BoxContent,
      event: BoxTypeConfig["event"] | undefined
    ) => any
  ): BoxTypeConfig["type"];

  set<EventName extends keyof WindowEventMap>(
    callbackfn: (
      currentValue: BoxContent,
      event: BoxTypeConfig["event"] | undefined
    ) => any,
    type?: EventName
  ): BoxTypeConfig["type"];

  set(
    callbackfn: (
      currentValue: BoxContent,
      event: BoxTypeConfig["event"] | undefined
    ) => any,
    type?: string
  ): BoxTypeConfig["type"];

  get(): BoxContent;

  change(newValue: BoxContent): BoxTypeConfig["type"];

  on<EventName extends keyof WindowEventMap>(
    type: EventName,
    callbackfn: (
      this: BoxTypeConfig["event"],
      boxEvent: BoxTypeConfig["event"]
    ) => void
  ): BoxTypeConfig["type"];
  on<EventName extends BoxTypeConfig["eventsList"]>(
    type: EventName,
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

  off<EventName extends BoxTypeConfig["eventsList"]>(
    type: EventName,
    callbackfn: Function
  ): BoxTypeConfig["type"];

  off<EventName extends keyof WindowEventMap>(
    type: EventName,
    callbackfn: Function
  ): BoxTypeConfig["type"];

  off(type: string, callbackfn: Function): BoxTypeConfig["type"];

  emit<EventName extends keyof WindowEventMap>(
    type: EventName,
    data?: any,
    emitEventConfig?: EmitEventConfig
  ): BoxTypeConfig["type"];
  emit<EventName extends BoxTypeConfig["eventsList"]>(
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
