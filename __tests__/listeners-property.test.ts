import { Box } from "../src/engine/Box";
describe("listeners property", () => {
  test("Initial value", () => {
    const box = Box();
    expect(box.listeners).toBeUndefined();
  });

  test("Add event", () => {
    const box = Box();
    const callbackfn = () => {};
    box.on("*anyEvent", callbackfn);
    expect(box.listeners).toEqual({
      "*anyEvent": [callbackfn],
    });
  });
});
