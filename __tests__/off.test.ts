import Box from "../src/engine/Box";

describe("Remove events in the box", () => {
  test("@beforeAdd", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeAdd", callbackfn);
    box.off("@beforeAdd", callbackfn);
    box(2022);
    expect(callbackfn).toBeCalledTimes(0);
  });

  test("+custom", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("+custom", callbackfn);
    box.off("+custom", callbackfn);
    box.emit("+custom");
    expect(callbackfn).toBeCalledTimes(0);
  });
  test("*broadcast", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("*broadcast", callbackfn);
    box.off("*broadcast", callbackfn);
    box.emit("*broadcast");
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
