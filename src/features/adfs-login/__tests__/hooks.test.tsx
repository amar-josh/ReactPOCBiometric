import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { getSessionStorageData } from "@/lib/sessionStorage";

import { useEmpInfo } from "../hooks";
import { IEmpInfo } from "../types";

// Mock getSessionStorageData
vi.mock("@/lib/sessionStorage", () => ({
  getSessionStorageData: vi.fn(),
}));

describe("useEmpInfo", () => {
  const mockedGetSessionStorageData = getSessionStorageData as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return employee info from session storage", () => {
    const mockData: IEmpInfo = {
      empName: "John Doe",
      branchCode: "BR123",
      empId: "E12345",
      department: "Emerging Entrepreneurs Business",
    };

    mockedGetSessionStorageData.mockReturnValue(mockData);

    const { result } = renderHook(() => useEmpInfo());

    expect(result.current).toEqual(mockData);
    expect(mockedGetSessionStorageData).toHaveBeenCalledWith(
      SESSION_STORAGE_KEY.EMP_INFO
    );
  });

  it("should return null if no data is found in session storage", () => {
    mockedGetSessionStorageData.mockReturnValue(null);

    const { result } = renderHook(() => useEmpInfo());

    expect(result.current).toBeNull();
    expect(mockedGetSessionStorageData).toHaveBeenCalledWith(
      SESSION_STORAGE_KEY.EMP_INFO
    );
  });

  it("should memoize the value and not call session storage again on re-render", () => {
    const mockData: IEmpInfo = {
      empName: "Alice",
      branchCode: "BR456",
      empId: "E67890",
      department: "Emerging Entrepreneurs Business",
    };

    mockedGetSessionStorageData.mockReturnValue(mockData);

    const { result, rerender } = renderHook(() => useEmpInfo());

    rerender();

    expect(result.current).toEqual(mockData);
    expect(mockedGetSessionStorageData).toHaveBeenCalledTimes(1);
  });
});
