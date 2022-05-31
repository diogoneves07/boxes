import { Box } from "../src/engine/Box";
describe("Broadcast event", () => {
  test("Add Broadcast event", () => {
    const callbackfn = jest.fn();
    const [box1, box2, box3] = Box(3);

    box1.on("*anyEvent", callbackfn);
    box2.on("*anyEvent", callbackfn);
    box3.emit("*anyEvent");

    expect(callbackfn).toBeCalledTimes(2);
    expect(callbackfn.mock.calls[0][0].broadcastBox).toBe(box3);
    expect(callbackfn.mock.calls[1][0].broadcastBox).toBe(box3);
  });
  test("Remove Broadcast event", () => {
    const callbackfn = jest.fn();
    const [box1, box2, box3] = Box(3);

    box1.on("*anyEvent", (e) => {
      e.off();
      callbackfn();
    });
    box2.off("*anyEvent", callbackfn);
    box3.emit("*anyEvent");

    expect(callbackfn).toBeCalledTimes(1);
  });
});
