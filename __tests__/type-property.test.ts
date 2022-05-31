import { Box } from "../src/engine/Box";
test("type property", () => {
  const box = Box();
  expect(box.type).toBe("normal");
});
