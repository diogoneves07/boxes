import {
  NormalBoxEventMap,
  NormalBoxEvent,
} from "./../types/normal-box-event-map";
import { GlobalEvents, WrapOn } from "./wrappers-event";

export const [lOnNormalize, onGlobalNormalize] = ((l: string) => [
  WrapOn<NormalBoxEvent>(l),
  GlobalEvents<NormalBoxEvent>(l),
])("@normalize");

export const [lOnChanged, onGlobalChanged] = ((l: string) => [
  WrapOn<NormalBoxEvent>(l),
  GlobalEvents<NormalBoxEvent>(l),
])("@changed");

export const [lOnBeforeChange, onGlobalBeforeChange] = ((l: string) => [
  WrapOn<NormalBoxEvent>(l),
  GlobalEvents<NormalBoxEvent>(l),
])("@beforeChange");

export const [lOnSeted, onGlobalSeted] = ((l: string) => [
  WrapOn<NormalBoxEvent>(l),
  GlobalEvents<NormalBoxEvent>(l),
])("@seted");

export const [lOnBeforeSet, onGlobalBeforeSet] = ((l: string) => [
  WrapOn<NormalBoxEvent>(l),
  GlobalEvents<NormalBoxEvent>(l),
])("@beforeSet");

export const [lOnBeforeAdd, onGlobalBeforeAdd] = ((l: string) => [
  WrapOn<NormalBoxEvent>(l),
  GlobalEvents<NormalBoxEvent>(l),
])("@beforeAdd");

export const [lOnAdded, onGlobalAdded] = ((l: string) => [
  WrapOn<NormalBoxEvent>(l),
  GlobalEvents<NormalBoxEvent>(l),
])("@added");

export const [lOnListenerAdded, onGlobalListenerAdded] = ((l: string) => [
  WrapOn<NormalBoxEventMap["@listenerAdded"]>(l),
  GlobalEvents<NormalBoxEventMap["@listenerAdded"]>(l),
])("@listenerAdded");

export const [lOnListenerRemoved, onGlobalListenerRemoved] = ((l: string) => [
  WrapOn<NormalBoxEventMap["@listenerRemoved"]>(l),
  GlobalEvents<NormalBoxEventMap["@listenerRemoved"]>(l),
])("@listenerRemoved");
