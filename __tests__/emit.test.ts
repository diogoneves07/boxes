import Box from "../src/engine/Box";
describe("Emit events", () => {
  test("Simple emission", () => {
    const callbackfn = jest.fn();
    const box = Box();
    box.on("+anyEvent", callbackfn);
    box.emit("+anyEvent");
    box.emit("+anyEvent");
    expect(callbackfn).toBeCalledTimes(2);
  });
  test("Emit when there was no event added in the box", () => {
    const box = Box();
    box.emit("+anyEvent");
  });
  test("Emit with data property", () => {
    const callbackfn = jest.fn();
    const box = Box();
    box.on("+anyEvent", callbackfn);
    box.emit("+anyEvent", [1, 2, 3, 4, 5]);
    expect(callbackfn).toBeCalledTimes(1);
    expect(callbackfn.mock.calls[0][0].data).toEqual([1, 2, 3, 4, 5]);
  });
  test("Emit injecting a new property in the event object", () => {
    const callbackfn = jest.fn();
    const box = Box();
    box.on("+anyEvent", callbackfn);
    box.emit("+anyEvent", null, {
      props: {
        anyProperty: true,
      },
    });
    expect(callbackfn).toBeCalledTimes(1);
    expect(callbackfn.mock.calls[0][0].data).toBeNull();
    expect(callbackfn.mock.calls[0][0].anyProperty).toBe(true);
  });

  test("Broadcast emission", () => {
    const callbackfn = jest.fn();
    const [box1, box2] = [0, 1].map(() => Box());
    box1.on("*anyEvent", callbackfn);
    box2.emit("*anyEvent");
    expect(callbackfn).toBeCalledTimes(1);
    expect(callbackfn.mock.calls[0][0].broadcastBox).toBe(box2);
  });
});
