function sum(a, b) {
  return a + b;
}
test("Deve Somar valores $a e $b", () => {
  expect(sum(3, 3)).toBe(6);
});
