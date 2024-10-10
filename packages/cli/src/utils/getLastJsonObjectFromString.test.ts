import { getLastJsonObjectFromString } from "./getLastJsonObjectFromString.ts";

describe("getLastJsonObjectFromString", () => {
  it("should handle stringified object", () => {
    expect(
      getLastJsonObjectFromString(JSON.stringify({ test: "foo" }))
    ).toEqual({ test: "foo" });
  });

  it("should handle stringified deep object", () => {
    expect(
      getLastJsonObjectFromString(
        JSON.stringify({
          test: "foo",
          bar: { baz: { qwe: "rty" }, arr: [1, 2, 3, 4] },
        })
      )
    ).toEqual({
      test: "foo",
      bar: { baz: { qwe: "rty" }, arr: [1, 2, 3, 4] },
    });
  });

  it("should handle leading whitespace", () => {
    expect(
      getLastJsonObjectFromString(
        `   \n\n  ${JSON.stringify({ test: "foo", baz: { qwe: "rty" } })}`
      )
    ).toEqual({ test: "foo", baz: { qwe: "rty" } });
  });

  it("should handle trailing whitespace", () => {
    expect(
      getLastJsonObjectFromString(
        `${JSON.stringify({ test: "foo", baz: { qwe: "rty" } })}   \n\n  `
      )
    ).toEqual({ test: "foo", baz: { qwe: "rty" } });
  });

  it("should handle trailing text", () => {
    expect(
      getLastJsonObjectFromString(
        `${JSON.stringify({ test: "foo", baz: { qwe: "rty" } })}   \n\n  test`
      )
    ).toEqual({ test: "foo", baz: { qwe: "rty" } });
  });

  it("should handle string with multiple objects", () => {
    expect(
      getLastJsonObjectFromString(
        `${JSON.stringify({
          test: "foo",
          baz: { qwe: "rty" },
        })}   \n\n  ${JSON.stringify({ much: "awesome" })}`
      )
    ).toEqual({ much: "awesome" });
  });

  it("should return `null` for an empty string", () => {
    expect(getLastJsonObjectFromString("")).toEqual(null);
  });

  it("should return `null` for a string with a broken object", () => {
    expect(getLastJsonObjectFromString(`{"bar:"`)).toEqual(null);
  });

  it("should return `null` for a string without an object", () => {
    expect(getLastJsonObjectFromString(`qwerty`)).toEqual(null);
  });
});
