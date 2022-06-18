import Box from "../src/engine/Box";

describe("Normalize box values", () => {
  test("Simple normalize", () => {
    const box = Box(0);
    box.normalize((v) => ++v);
    expect(box.get()).toBe(1);
  });
  test("Normalize after event", () => {
    const box = Box(0);
    box.normalize((v) => ++v, "+anyEvent");
    expect(box.get()).toBe(0);
    box.emit("+anyEvent");
    expect(box.get()).toBe(1);
  });
});
