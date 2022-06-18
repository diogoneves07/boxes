import Box from "../src/engine/Box";
test("hasBoxes method", () => {
  const box1 = Box(Box(2022));
  const box2 = Box(2022);
  const box3 = Box([box1, 2022]);
  const box4 = Box(box1, box2, box3);
  expect(Box.hasBoxes("")).toBe(false);
  expect(Box.hasBoxes(box1)).toBe(true);
  expect(Box.hasBoxes(box2)).toBe(false);
  expect(Box.hasBoxes(box3)).toBe(true);
  expect(Box.hasBoxes(box4, "normal")).toBe(false);
  expect(Box.hasBoxes(box4, ["normal"])).toBe(false);
});
