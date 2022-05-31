import { Box } from "../src/engine/Box";

test("@beforeAdd", () => {
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
  expect(callbackfn.mock.calls[0][0].type).toBe("@beforeGet");
  expect(callbackfn.mock.calls[1][0].type).toBe("@beforeAdd");
  expect(callbackfn.mock.calls[2][0].type).toBe("@beforeChange");
  expect(callbackfn.mock.calls[3][0].type).toBe("@added");
  expect(callbackfn.mock.calls[4][0].type).toBe("@changed");
  expect(callbackfn.mock.calls[5][0].type).toBe("@beforeGet");
  expect(callbackfn.mock.calls[6][0].type).toBe("@beforeSet");
  expect(callbackfn.mock.calls[7][0].type).toBe("@beforeChange");
  expect(callbackfn.mock.calls[8][0].type).toBe("@seted");
  expect(callbackfn.mock.calls[9][0].type).toBe("@changed");
  expect(callbackfn.mock.calls[10][0].type).toBe("@beforeChange");
  expect(callbackfn.mock.calls[11][0].type).toBe("@changed");
  expect(callbackfn).toBeCalledTimes(12);
});
