import { Box } from "../src/engine/Box";
test("type property value", () => {
  const box = Box();
  expect(box.type).toBe("normal");
});
