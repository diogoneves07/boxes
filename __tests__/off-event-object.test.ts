import Box from "../src/engine/Box";

describe("Remove events in the box with the off method of the event object", () => {
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
  test("@added", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@added", (event) => {
      callbackfn();
      event.off();
    });
    box(2021);
    box(2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@beforeGet", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeGet", (event) => {
      callbackfn();
      event.off();
    });
    box.get();
    box.get();
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@beforeSet", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeSet", (event) => {
      callbackfn();
      event.off();
    });
    box.set(() => 2021);
    box.set(() => 2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@seted", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@seted", (event) => {
      callbackfn();
      event.off();
    });
    box.set(() => 2021);
    box.set(() => 2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@beforeChange", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@beforeChange", (event) => {
      callbackfn();
      event.off();
    });
    box(2000);
    box.set((v) => v + 21);
    box.change(2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
  test("@changed", () => {
    const box = Box();
    const callbackfn = jest.fn();
    box.on("@changed", (event) => {
      callbackfn();
      event.off();
    });
    box(2000);
    box.set((v) => v + 21);
    box.change(2022);
    expect(callbackfn).toBeCalledTimes(1);
  });
});
