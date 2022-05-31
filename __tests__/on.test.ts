import { Box } from "../src/engine/Box";

describe("Add events in the box", () => {
  test("@beforeAdd", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeAdd", callbackfn);
    box(2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@added", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@added", callbackfn);
    box(2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@beforeGet", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeGet", callbackfn);
    box.get();
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@beforeSet", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeSet", callbackfn);
    box.set(() => 2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@seted", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@seted", callbackfn);
    box.set(() => 2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@beforeChange", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeChange", callbackfn);
    box(2000);
    box.set((v) => v + 21);
    box.change(2022);
    expect(callbackfn).toBeCalledTimes(3);
  });
  test("@changed", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@changed", callbackfn);
    box(2000);
    box.set((v) => v + 21);
    box.change(2022);
    expect(callbackfn).toBeCalledTimes(3);
  });

  test("Empty string", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("   ", callbackfn);
    box.emit("   ");
    expect(callbackfn).toBeCalledTimes(0);
  });
});
