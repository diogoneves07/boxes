import Box from "./../src/engine/Box";

describe("Getting the current value of the box", () => {
  test("Initial value", () => {
    const box = Box();
    expect(box.get()).toBeNull();
  });

  test("When is a string value", () => {
    const box = Box("Hello World!");
    expect(box.get()).toBe("Hello World!");
  });

  test("When is a number value", () => {
    const box = Box(2022);
    expect(box.get()).toBe(2022);
  });

  test("When is a array value", () => {
    const box = Box([1, 2, 3]);
    expect(box.get()).toEqual([1, 2, 3]);
  });
});
