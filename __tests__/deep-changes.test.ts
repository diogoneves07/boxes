import Box from "../src/engine/Box";

describe("Use deep changes event", () => {
  test("Off @deepChanges", (done) => {
    const box1 = Box(["something else", 2022, Box("Hello World!!!")]);
    const box2 = Box(box1);
    const callbackfn = jest.fn();
    box2.on("@deepChanges", callbackfn);
    box1(2022);

    setTimeout(() => {
      box2.off("@deepChanges", callbackfn);
      box1(2022);
      expect(callbackfn).toBeCalledTimes(1);
      done();
    }, 50);
  });

  test("onlyChanged method of the event object", (done) => {
    const box1 = Box();
    const box2 = Box(box1, "something else");
    let box1onlyChanged = false;
    let checkBoxesTypes: any[] = ["normal", "another-type"];
    let checkBoxes = true;
    box2.on("@deepChanges", (e) => {
      box1onlyChanged = e.onlyChanged(box1);
      checkBoxesTypes = checkBoxesTypes.map((type) => e.onlyChanged(type));
      checkBoxes = e.onlyChanged([box1, box2]);
    });
    box1(2022);

    setTimeout(() => {
      expect(box1onlyChanged).toBe(true);
      expect(checkBoxesTypes).toEqual([true, false]);
      expect(checkBoxesTypes).toEqual([true, false]);
      expect(checkBoxes).toEqual(false);
      done();
    }, 50);
  });
});
