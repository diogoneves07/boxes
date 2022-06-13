import Box from "../src/engine/Box";

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

  test("@normalize", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@normalize", callbackfn);
    box.set(() => 2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@beforeNormalize", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeNormalize", callbackfn);
    box.normalize((value) => parseFloat(value));
    box.set(() => "2022");
    expect(callbackfn).toBeCalledTimes(1);
  });

  test("@normalized", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@normalized", callbackfn);
    box.normalize((value) => parseFloat(value));
    box.set(() => "2022");
    expect(callbackfn).toBeCalledTimes(1);
  });

  test("@deepChanges", (done) => {
    const box1 = Box();
    const box2 = Box(box1, "something else");
    const callbackfn = jest.fn();
    box2.on("@deepChanges", callbackfn);
    box1(2022);
    setTimeout(() => {
      expect(callbackfn).toBeCalledTimes(1);
      done();
    }, 100);
  });

  test("@eventAdded", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@eventAdded", callbackfn);
    box.on("+any", () => {});
    expect(callbackfn).toBeCalled();
  });

  test("@eventRemoved", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@eventRemoved", callbackfn);
    box.on("+any", callbackfn);
    box.off("+any", callbackfn);
    expect(callbackfn).toBeCalled();
  });
});
