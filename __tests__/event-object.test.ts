import Box from "../src/engine/Box";

describe("Event object properties", () => {
  test("Check properties in object", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@added", callbackfn);

    box(2022);

    expect(callbackfn.mock.calls[0][0]).toEqual({
      type: "@added",
      data: null,
      box: box,
      broadcastBox: null,
      off: callbackfn.mock.calls[0][0].off,
    });

    expect(callbackfn.mock.calls[0][0].off).toBeTruthy();
  });

  describe("off method of the event object", () => {
    test("@beforeAdd", () => {
      const box = Box();
      const callbackfn = jest.fn();
      box.on("@beforeAdd", (event) => {
        callbackfn();
        event.off();
      });
      box(2021);
      box(2022);
      expect(callbackfn).toBeCalledTimes(1);
    });
    test("+custom", () => {
      const box = Box();
      const callbackfn = jest.fn();
      box.on("+custom", (event) => {
        callbackfn();
        event.off();
      });
      box.emit("+custom");
      box.emit("+custom");
      expect(callbackfn).toBeCalledTimes(1);
    });
    test("*broadcast", () => {
      const box = Box();
      const callbackfn = jest.fn();
      box.on("*broadcast", (event) => {
        callbackfn();
        event.off();
      });
      box.emit("*broadcast");
      box.emit("*broadcast");
      expect(callbackfn).toBeCalledTimes(1);
    });
  });
});
