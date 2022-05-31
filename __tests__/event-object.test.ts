import { Box } from "../src/engine/Box";

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
});
