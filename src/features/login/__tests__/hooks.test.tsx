import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLogin } from "../hooks";
import * as services from "../services";
import { ILoginResponse } from "../types";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLogin hook", () => {
  const mockResponse: ILoginResponse = {
    statusCode: 200,
    status: "SUCCESS",
    message: "Login successful",
    data: {
      cognitoToken: "fake-token",
      userAttributes: {
        empName: "Test User",
        empId: "EMP001",
        branchCode: "BR001",
        department: "IT",
        email: "test@example.com",
      },
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should call loginService and return data on success", async () => {
    const loginMock = vi
      .spyOn(services, "loginService")
      .mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ username: "test", password: "1234" });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(loginMock).toHaveBeenCalledWith({
      username: "test",
      password: "1234",
    });
    expect(result.current.data).toEqual(mockResponse);
  });

  it("should set error if loginService fails", async () => {
    const error = new Error("Invalid credentials");
    vi.spyOn(services, "loginService").mockRejectedValue(error);

    const { result } = renderHook(() => useLogin(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ username: "wrong", password: "wrong" });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
  });
});
