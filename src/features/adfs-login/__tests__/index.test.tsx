import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import * as sessionStorageLib from "@/lib/sessionStorage";
import { ROUTES } from "@/routes/constants";
import * as apiService from "@/services/api.service";

import ADFSLogin from "..";

// Mock navigate
const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock storage and api calls
vi.mock("@/lib/sessionStorage", () => ({
  setSessionStorageData: vi.fn(),
}));

vi.mock("@/services/api.service", () => ({
  updateTokenValue: vi.fn(),
}));

describe("ADFSLogin Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects and stores session data if token exists", () => {
    const token = "mock-token";
    const empId = "E123";
    const empName = "John";
    const branchCode = "XYZ";
    const department = "ABC";

    render(
      <MemoryRouter
        initialEntries={[
          `/adfs-login?token=${token}&empId=${empId}&empName=${empName}&empLocation=${branchCode}&empDepartment=${department}`,
        ]}
      >
        <Routes>
          <Route path="/adfs-login" element={<ADFSLogin />} />
        </Routes>
      </MemoryRouter>
    );

    // ✅ Assert correct storage keys
    expect(sessionStorageLib.setSessionStorageData).toHaveBeenCalledWith(
      SESSION_STORAGE_KEY.TOKEN,
      token
    );

    expect(sessionStorageLib.setSessionStorageData).toHaveBeenCalledWith(
      SESSION_STORAGE_KEY.EMP_INFO,
      { empId, empName, branchCode, department }
    );

    expect(apiService.updateTokenValue).toHaveBeenCalledWith(token);
    expect(mockedNavigate).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it("shows loader if token does not exist", () => {
    render(
      <MemoryRouter initialEntries={["/adfs-login"]}>
        <Routes>
          <Route path="/adfs-login" element={<ADFSLogin />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("LottieMock")).toBeInTheDocument();
  });
});
