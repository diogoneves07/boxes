import Box from "../src/engine/Box";
test("Add values in the box", () => {
  const box = Box(2022);
  expect(box.get()).toBe(2022);
});
