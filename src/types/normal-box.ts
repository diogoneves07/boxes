import { BoxesTypeConfig } from "./boxes-type-config";
import { NormalBoxEvents } from "./events";

type NormalBoxConfig<BoxContent> = {
  type: NormalBox<BoxContent>;
  event: Required<NormalBoxEvent>;
  eventsList: NormalBoxEvents;
  eventMap: BoxEventMap;
};

export type NormalBoxEvent<
  BoxTypeConfig extends BoxesTypeConfig = BoxesTypeConfig
> = {
  type: (keyof WindowEventMap | BoxTypeConfig["eventsList"] | String) & string;
  data: any | null;
  box: BoxTypeConfig["type"];
  broadcastBox: BoxTypeConfig["type"] | null;
  off(): void;
};

export type DeepChangesBoxEvent<
  BoxTypeConfig extends BoxesTypeConfig = BoxesTypeConfig
> = NormalBoxEvent<BoxTypeConfig> & {
  onlyChanged: (...args: (BoxTypeConfig["type"] | string)[]) => boolean;
  changedBoxes: BoxTypeConfig["type"][];
};

export type ListenerAddedBoxEvent<
  BoxTypeConfig extends BoxesTypeConfig = BoxesTypeConfig
> = NormalBoxEvent<BoxTypeConfig> & {
  listenerAdded: {
    type: BoxTypeConfig["eventsList"];
    fn: Function;
  };
};

export type ListenerRemovedBoxEvent<
  BoxTypeConfig extends BoxesTypeConfig = BoxesTypeConfig
> = NormalBoxEvent<BoxTypeConfig> & {
  listenerRemoved: {
    type: BoxTypeConfig["eventsList"];
    fn: Function;
  };
};

export type NormalBoxInternalData = {
  content: any | null;
  cacheDataIntoBoxes: undefined | any;
};

export type EmitEventConfig = {
  props?: Record<string, any>;
};

export interface BoxEventMap<
  BoxTypeConfig extends BoxesTypeConfig = BoxesTypeConfig
> {
  "@deepChanges": DeepChangesBoxEvent<BoxTypeConfig>;

  "@listenerAdded": ListenerAddedBoxEvent<BoxTypeConfig>;

  "@listenerRemoved": ListenerRemovedBoxEvent<BoxTypeConfig>;
}
export interface NormalBox<
  BoxContent = any,
  BoxTypeConfig extends BoxesTypeConfig = NormalBoxConfig<BoxContent>
> {
  (newValue: BoxContent): BoxTypeConfig["type"];
  (...newValues: BoxContent[]): BoxTypeConfig["type"];

  __data: NormalBoxInternalData;

  listeners?: Record<string, Set<(event: BoxTypeConfig["event"]) => void>>;

  type: string;

  isBox: true;

  id: number;

  set(callbackfn: (currentValue: any) => any): BoxTypeConfig["type"];

  set(
    callbackfn: (currentValue: any, event: BoxTypeConfig["event"]) => any,
    type: BoxTypeConfig["eventsList"]
  ): BoxTypeConfig["type"];

  set<C extends Function, K extends keyof BoxTypeConfig["eventMap"]>(
    callbackfn: (currentValue: any, event: BoxTypeConfig["event"]) => any,
    type: K
  ): BoxTypeConfig["type"];

  set(
    callbackfn: (currentValue: any, event: BoxTypeConfig["event"]) => any,
    type: string
  ): BoxTypeConfig["type"];

  normalize(callbackfn: (currentValue: any) => any): BoxTypeConfig["type"];

  normalize(
    callbackfn: (currentValue: any, event: BoxTypeConfig["event"]) => any,
    type: BoxTypeConfig["eventsList"]
  ): BoxTypeConfig["type"];

  normalize<C extends Function, K extends keyof BoxTypeConfig["eventMap"]>(
    callbackfn: (currentValue: any, event: BoxTypeConfig["event"]) => any,
    type: K
  ): BoxTypeConfig["type"];

  normalize(
    callbackfn: (currentValue: any, event: BoxTypeConfig["event"]) => any,
    type: string
  ): BoxTypeConfig["type"];

  setIndex(...args: (number | unknown)[]): BoxTypeConfig["type"];

  get(): any;

  change(...newValue: any[]): BoxTypeConfig["type"];

  has(value: any): boolean;

  getDataIntoBoxes(
    ignoreBoxes?: NormalBox | string | (NormalBox | string)[]
  ): any;

  on<K extends keyof BoxTypeConfig["eventMap"]>(
    type: K,
    callbackfn: (
      this: BoxTypeConfig["eventMap"][K],
      boxEvent: BoxTypeConfig["eventMap"][K]
    ) => void
  ): BoxTypeConfig["type"];

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
