import Box from "../src/engine/Box";

describe("Use data into boxes", () => {
  test("Simple use", () => {
    const box1 = Box();
    const box2 = Box([box1, "something else"]);
    const box3 = Box(2022);
    box1(box3);
    expect(box3.getDataInBoxes()).toBe(2022);
    expect(box2.getDataInBoxes()).toEqual([2022, "something else"]);
  });
  test("Simple use", () => {
    const box1 = Box();
    const box2 = Box(box1, "something else");
    const box3 = Box(2022);
    box1(box3);
    expect(box2.getDataInBoxes()).toEqual([2022, "something else"]);
  });
  test("Removes specific boxes type", () => {
    const box1 = Box();
    const box2 = Box(box1, "something else");
    box1(2022);
    expect(box2.getDataInBoxes(["normal"])).toEqual([box1, "something else"]);
    expect(box2.getDataInBoxes("normal")).toEqual([box1, "something else"]);
  });
});
