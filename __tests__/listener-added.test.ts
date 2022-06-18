import Box from "../src/engine/Box";

describe("Use listener added event", () => {
  test("Simple use", () => {
    const box1 = Box();
    const callbackfn = jest.fn();
    box1.on("@listenerAdded", callbackfn);
    expect(callbackfn).toBeCalledTimes(0);
    box1.on("+anyEvent", callbackfn);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("Check event object properties", () => {
    const box1 = Box();
    const callbackfn = jest.fn();
    box1.on("@listenerAdded", (e) => {
      expect(e.listenerAdded).toEqual({ type: "+anyEvent", fn: callbackfn });
    });
    box1.on("+anyEvent", callbackfn);
  });
});
