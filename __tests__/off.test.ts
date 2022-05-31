import { Box } from "../src/engine/Box";

describe("Remove events in the box", () => {
  test("@beforeAdd", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeAdd", callbackfn);
    box.off("@beforeAdd", callbackfn);
    box(2022);
    expect(callbackfn).toBeCalledTimes(0);
  });
  test("@added", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@added", callbackfn);
    box.off("@added", callbackfn);
    box(2022);
    expect(callbackfn).toBeCalledTimes(0);
  });
  test("@beforeGet", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeGet", callbackfn);
    box.off("@beforeGet", callbackfn);
    box.get();
    expect(callbackfn).toBeCalledTimes(0);
  });
  test("@beforeSet", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeSet", callbackfn);
    box.off("@beforeSet", callbackfn);
    box.set(() => 2022);
    expect(callbackfn).toBeCalledTimes(0);
  });
  test("@seted", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@seted", callbackfn);
    box.off("@seted", callbackfn);
    box.set(() => 2022);
    expect(callbackfn).toBeCalledTimes(0);
  });
  test("@beforeChange", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeChange", callbackfn);
    box.off("@beforeChange", callbackfn);
    box(2000);
    box.set((v) => v + 21);
    box.change(2022);
    expect(callbackfn).toBeCalledTimes(0);
  });
  test("@changed", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@changed", callbackfn);
    box.off("@changed", callbackfn);
    box(2000);
    box.set((v) => v + 21);
    box.change(2022);
    expect(callbackfn).toBeCalledTimes(0);
  });

  test("Added with set method", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.set(callbackfn, "*anyEvent");
    box.off("*anyEvent", callbackfn);
    box.emit("*anyEvent");
    expect(callbackfn).toBeCalledTimes(0);
  });

  test("No event added", () => {
    const box = Box();
    const callbackfn = jest.fn();
    // Just to create the listeners property in the box
    box.on("@added", () => {});

    box.off("+anyEvent", callbackfn);
  });
});
