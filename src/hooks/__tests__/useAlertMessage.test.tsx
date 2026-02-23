import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SUCCESS } from "@/constants/globalConstant";

import { useAlertMessage } from "../useAlertMessage";

describe("useAlertMessage", () => {
  it("should initialize with default success type and empty message", () => {
    const { result } = renderHook(() =>
      useAlertMessage("error", "Something went wrong", false)
    );

    expect(result.current.alertMessage).toEqual({
      type: SUCCESS,
      message: "",
    });
  });

  it("should update alert message when isShowAlert is true", () => {
    const { result, rerender } = renderHook(
      ({ type, message, isShowAlert }) =>
        useAlertMessage(type as "error" | "success", message, isShowAlert),
      {
        initialProps: {
          type: "error",
          message: "Something went wrong",
          isShowAlert: false,
        },
      }
    );

    // Initially should be default state
    expect(result.current.alertMessage).toEqual({
      type: SUCCESS,
      message: "",
    });

    // Rerender with isShowAlert true
    rerender({
      type: "error",
      message: "Something went wrong",
      isShowAlert: true,
    });

    expect(result.current.alertMessage).toEqual({
      type: "error",
      message: "Something went wrong",
    });
  });

  it("should default message to empty string if undefined", () => {
    const { result } = renderHook(() =>
      useAlertMessage("success", undefined, true)
    );

    expect(result.current.alertMessage).toEqual({
      type: "success",
      message: "",
    });
  });
});
