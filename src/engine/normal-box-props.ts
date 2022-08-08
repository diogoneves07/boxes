import { AnyBox } from "./../types/boxes";
import { setBoxByKey } from "./boxes-keyed";
import { NormalBoxEventMap } from "./../types/normal-box-event-map";
import { NormalBox } from "../types/normal-box";
import { addBoxListener } from "./add-box-listener";
import runSet from "./run-set";
import runNormalize from "./run-normalize";
import resetPropsLinkedData from "./reset-props-linked-data";
import {
  defineBoxParentsAndPossibleObservers,
  removeOldParentsAndPossibleObservers,
} from "./parents-and-possible-observers";
import { forceTemporaryCurrentBoxPointed } from "./get-boxes-pointed";
import getBoxInternalData from "./get-box-internal-data";
import { emitEvents } from "./emit-events";
import isBox from "./is-box";
import { setCurrentEventFlag } from "./global-listeners-store";

const forEachBoxDeep = (
  box: AnyBox,
  callbackfns: ((self: AnyBox) => unknown)[]
) => {
  let childBoxes: AnyBox[] = [];

  let contents = getBoxInternalData(box).contents;
  contents = Array.isArray(contents) ? contents : [contents];
  if (contents) {
    for (const item of contents) {
      if (isBox(item)) {
        childBoxes.push(item);
        for (const callbackfn of callbackfns) {
          forceTemporaryCurrentBoxPointed(item, callbackfn);
        }
      }
    }
  }
  if (childBoxes.length > 0) {
    for (const b of childBoxes) {
      forEachBoxDeep(b, callbackfns);
    }
  }
};

export const NormalBoxProps: Partial<NormalBox> = {
  get(this: NormalBox) {
    return getBoxInternalData(this).contents;
  },

  set(
    this: AnyBox,
    callbackfn: (currentValue: any, event: NormalBoxEventMap["*"]) => any,
    eventName?: string
  ) {
    if (typeof eventName === "string") {
      addBoxListener(this, eventName, (e: any) => {
        runSet(this, callbackfn, e);
      });
    } else {
      runSet(this, callbackfn);
    }

    return this;
  },

  normalize(
    this: AnyBox,
    callbackfn: (currentValue: any, event: NormalBoxEventMap["*"]) => any,
    eventName?: string
  ) {
    if (typeof eventName === "string") {
      addBoxListener(this, eventName, (e: any) => {
        runNormalize(this, callbackfn, e);
      });
    } else {
      runNormalize(this, callbackfn);
    }

    return this;
  },

  new(this: AnyBox, ...newValues: any[]) {
    emitEvents(this, "@beforeChange");

    removeOldParentsAndPossibleObservers(
      this,
      getBoxInternalData(this).contents
    );

    getBoxInternalData(this).contents = newValues[1] ? newValues : newValues[0];

    defineBoxParentsAndPossibleObservers(
      this,
      getBoxInternalData(this).contents
    );

    resetPropsLinkedData(this);

    emitEvents(this, "@normalize");
    emitEvents(this, "@changed");

    return this;
  },

  it(this: AnyBox, ...callbackfns: ((self: NormalBox) => unknown)[]) {
    setCurrentEventFlag(this.it);
    let values: any;
    for (const callbackfn of callbackfns) {
      values = forceTemporaryCurrentBoxPointed(this, callbackfn);
    }
    return values;
  },

  nodes(this: AnyBox, ...callbackfns: ((self: NormalBox) => unknown)[]) {
    setCurrentEventFlag(this.nodes);
    forEachBoxDeep(this, callbackfns);
    setCurrentEventFlag(this.it);

    return this;
  },

  subtree(this: AnyBox, ...callbackfns: ((self: NormalBox) => unknown)[]) {
    setCurrentEventFlag(this.subtree);

    for (const callbackfn of callbackfns) {
      forceTemporaryCurrentBoxPointed(this, callbackfn);
    }

    forEachBoxDeep(this, callbackfns);

    setCurrentEventFlag(this.it);
    return this;
  },

  childs(this: AnyBox, ...callbackfns: ((self: NormalBox) => unknown)[]) {
    setCurrentEventFlag(this.childs);
    const data = getBoxInternalData(this);
    if (data.contents) {
      for (const item of data.contents) {
        if (isBox(item)) {
          for (const callbackfn of callbackfns) {
            forceTemporaryCurrentBoxPointed(item, callbackfn);
          }
        }
      }
    }
    setCurrentEventFlag(this.it);

    return this;
  },

  key(this: AnyBox, key: any) {
    setBoxByKey(this, key);
    return this;
  },
};
