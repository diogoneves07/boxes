import Box from "../src/engine/Box";

test("Events with the same callbackfn", () => {
  const box = Box();
  const callbackfn = jest.fn();
  box.on(
    "@beforeGet @beforeAdd @added @beforeSet @seted @beforeChange @changed",
    callbackfn
  );
  box.get(); // calls: @beforeGet
  box(2020); // calls: @beforeAdd, @beforeChange, @added, @changed
  box.set(() => 2021); // calls: @beforeGet, @beforeSet, @beforeChange, @seted, @changed
  box.change(2022); // calls: @beforeChange, @changed

  const calls = callbackfn.mock.calls;
  expect(calls[0][0].type).toBe("@beforeGet");
  expect(calls[1][0].type).toBe("@beforeAdd");
  expect(calls[2][0].type).toBe("@beforeChange");
  expect(calls[3][0].type).toBe("@added");
  expect(calls[4][0].type).toBe("@changed");
  expect(calls[5][0].type).toBe("@beforeSet");
  expect(calls[6][0].type).toBe("@beforeChange");
  expect(calls[7][0].type).toBe("@seted");
  expect(calls[8][0].type).toBe("@changed");
  expect(calls[9][0].type).toBe("@beforeChange");
  expect(calls[10][0].type).toBe("@changed");
  expect(callbackfn).toBeCalledTimes(11);
});
