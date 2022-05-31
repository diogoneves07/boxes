import { Box } from "../src/engine/Box";

describe("Set box values per index", () => {
  test("Simple set", () => {
    const box1 = Box()(["Hello", "Hello!"]);
    box1.setIndex(1, "World!");

    const box2 = Box()("Hello");
    box2.setIndex(0, "World!");
    expect(box1.get()).toEqual(["Hello", "World!"]);
    expect(box2.get()).toEqual("World!");
  });
  test("Index is greater than length of the values", () => {
    const box = Box()("Hello", "Hello!");
    box.setIndex(10, "World!");
    expect(box.get()).toEqual(["Hello", "Hello!"]);
  });
  test("Random position indexes", () => {
    const box = Box()("Any", "Any");
    box.setIndex(10, "World!", 1, "Hello!", 0, "World!");
    expect(box.get()).toEqual(["World!", "Hello!"]);
  });
});
