import { Box } from "../src/engine/Box";
test("Change box values", () => {
  const box = Box()(0);
  box.change(2022);
  expect(box.get()).toBe(2022);
});
