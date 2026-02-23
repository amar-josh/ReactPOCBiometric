import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useDisableDevTool from "../useDisableDevTool";

describe("useDisableDevTool", () => {
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;

  beforeEach(() => {
    // Spy on document.addEventListener / removeEventListener
    addEventListenerSpy = vi.spyOn(document, "addEventListener");
    removeEventListenerSpy = vi.spyOn(document, "removeEventListener");
  });

  it("should attach contextmenu and keydown event listeners on mount", () => {
    const { unmount } = renderHook(() => useDisableDevTool());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "contextmenu",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "contextmenu",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("should prevent default on right-click", () => {
    renderHook(() => useDisableDevTool());

    const event = new MouseEvent("contextmenu");
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should prevent default on F12", () => {
    renderHook(() => useDisableDevTool());

    const event = new KeyboardEvent("keydown", { key: "F12" });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should prevent default on Ctrl+U", () => {
    renderHook(() => useDisableDevTool());

    const event = new KeyboardEvent("keydown", { key: "U", ctrlKey: true });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should prevent default on Ctrl+Shift+I", () => {
    renderHook(() => useDisableDevTool());

    const event = new KeyboardEvent("keydown", {
      key: "I",
      ctrlKey: true,
      shiftKey: true,
    });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    document.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not prevent default on other keys", () => {
    renderHook(() => useDisableDevTool());

    const event = new KeyboardEvent("keydown", { key: "A" });
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    document.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
