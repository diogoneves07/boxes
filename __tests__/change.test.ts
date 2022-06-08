import { Box } from "../src/engine/Box";
test("Change box values", () => {
  const box = Box()(0);
  box.change(2022);
  expect(box.get()).toBe(2022);
  box.change(2021, 2022);
  expect(box.get()).toEqual([2021, 2022]);
});
