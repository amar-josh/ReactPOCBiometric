import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SUCCESS } from "@/constants/globalConstant";

import { useAlertMessage } from "../useAlertMessage";

describe("useAlertMessage", () => {
  it("should return default alertMessage with empty message and SUCCESS type", () => {
    const { result } = renderHook(() =>
      useAlertMessage("error", "Some error", false)
    );

    expect(result.current.alertMessage).toEqual({
      type: SUCCESS,
      message: "",
    });
  });

  it("should update alertMessage when isShowAlert is true", () => {
    const { result, rerender } = renderHook(
      ({ type, message, isShow }) => useAlertMessage(type, message, isShow),
      {
        initialProps: {
          type: "error" as const,
          message: "Something went wrong",
          isShow: true,
        },
      }
    );

    expect(result.current.alertMessage).toEqual({
      type: "error",
      message: "Something went wrong",
    });

    // Updating props: simulate dynamic change
    rerender({
      type: "success",
      message: "Success message",
      isShow: true,
    });

    expect(result.current.alertMessage).toEqual({
      type: "success",
      message: "Success message",
    });
  });

  it("should allow manual update using setAlertMessage", () => {
    const { result } = renderHook(() =>
      useAlertMessage("error", "Initial error", true)
    );

    act(() => {
      result.current.setAlertMessage({
        type: "success",
        message: "Manually set message",
      });
    });

    expect(result.current.alertMessage).toEqual({
      type: "success",
      message: "Manually set message",
    });
  });

  it("should not update alertMessage if isShowAlert is false", () => {
    const { result } = renderHook(() =>
      useAlertMessage("error", "Won't show this", false)
    );

    expect(result.current.alertMessage).toEqual({
      type: SUCCESS,
      message: "",
    });
  });
});
