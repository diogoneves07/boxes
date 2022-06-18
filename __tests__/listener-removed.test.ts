import Box from "../src/engine/Box";

describe("Use listener removed event", () => {
  test("Simple use", () => {
    const box1 = Box();
    const callbackfn = jest.fn();
    box1.on("@listenerRemoved", callbackfn);
    box1.on("+anyEvent", callbackfn);
    box1.off("+anyEvent", callbackfn);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("Check event object properties", () => {
    const box1 = Box();
    const callbackfn = jest.fn();
    box1.on("@listenerRemoved", (e) => {
      expect(e.listenerRemoved).toEqual({ type: "+anyEvent", fn: callbackfn });
    });
    box1.on("+anyEvent", callbackfn);
    box1.off("+anyEvent", callbackfn);
  });
});
