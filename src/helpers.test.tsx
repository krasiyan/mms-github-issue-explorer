import React from "react";
import { render, cleanup } from "@testing-library/react";

import { readKeyFromLocalStorage, useStickyState } from "./helpers";

describe("helpers", () => {
  const mockGetItem = jest.fn();
  const mockSetItem = jest.fn();
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("readKeyFromLocalStorage", () => {
    expect(readKeyFromLocalStorage("missingKey", "default")).toEqual("default");
    expect(mockGetItem.mock.calls).toEqual([["missingKey"]]);

    mockGetItem.mockReturnValue('"value"');
    expect(readKeyFromLocalStorage("existingKey", "default")).toEqual("value");

    mockGetItem.mockReturnValue('{"someKey": "someValue"}');
    expect(readKeyFromLocalStorage("existingKey", "default")).toEqual({
      someKey: "someValue",
    });

    mockGetItem.mockReturnValue("invalidJson");
    expect(readKeyFromLocalStorage("existingKey", "default")).toEqual(
      "default"
    );

    mockGetItem.mockReturnValue("true");
    expect(readKeyFromLocalStorage("existingKey", "default")).toEqual(true);

    mockGetItem.mockReturnValue("");
    expect(readKeyFromLocalStorage("existingKey", "default")).toEqual(
      "default"
    );
  });

  describe("useStickyState", () => {
    afterEach(cleanup);

    test("initializes sticky state with default", () => {
      const TestComponent = (): React.ReactElement => {
        const [value] = useStickyState("someKey", "default");
        expect(value).toEqual("default");

        return <></>;
      };
      render(<TestComponent />);

      expect(mockGetItem).toHaveBeenCalledTimes(1);
      expect(mockGetItem).toHaveBeenCalledWith("someKey");
    });

    test("initializes sticky state with value from the local storage", () => {
      mockGetItem.mockReturnValue('"someValue"');

      const TestComponent = (): React.ReactElement => {
        const [value] = useStickyState("someKey", "default");
        expect(value).toEqual("someValue");

        return <></>;
      };
      render(<TestComponent />);
    });

    test.todo("updates value in local storage");
  });
});
