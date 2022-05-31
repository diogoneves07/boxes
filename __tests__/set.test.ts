import { Box } from "../src/engine/Box";

describe("Set box values", () => {
  test("Simple set", () => {
    const box = Box()(0);
    box.set((v) => ++v);
    expect(box.get()).toBe(1);
  });
  test("Set after event", () => {
    const box = Box()(0);
    box.set((v) => ++v, "+anyEvent");
    expect(box.get()).toBe(0);
    box.emit("+anyEvent");
    expect(box.get()).toBe(1);
  });
});
