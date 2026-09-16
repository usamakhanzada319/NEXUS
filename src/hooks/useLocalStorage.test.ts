import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

//useLocalStorage hook's behaviour;
// is Data Save ,Read and Update properly

describe("useLocalStorage", () => {
  //run before every text
  beforeEach(() => {
    localStorage.clear(); //remove all prev data , for tests dont affect(isolation)
    vi.clearAllMocks(); //all mocked functions call history reset
    vi.spyOn(Storage.prototype, "setItem"); // (for new spy l )
    // vi.spyOn(Storage.prototype, "getItem"); // (if getItem  test )
  });

  // Test 1: Initial value => return initial value when localStorage is Empty

  it("returns initial value when no stored value", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
  });
  //  Test 2: Store value

  it("stores value in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("updated"),
    );
  });

  //  Test 3: Read stored value

  it("reads value from localStorage on mount", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify("stored-value"),
    );
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("stored-value");
  });

  //  Test 4: Function updater

  it("supports function updater", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage("count", 0));
    act(() => {
      result.current[1]((prev) => prev + 1);
    });
    expect(result.current[0]).toBe(1);
  });
});
