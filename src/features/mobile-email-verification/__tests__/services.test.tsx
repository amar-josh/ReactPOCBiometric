import { describe, expect, it, vi } from "vitest";

import { MOBILE_EMAIL_VERIFICATION_ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import {
  generateVerifyLinkRequest,
  generateVerifyLinkResponse,
} from "../mocks/generateVerifyLinkMock"; // adjust path if needed
import {
  generateLinkRequestMock,
  generateLinkResponseMock,
} from "../mocks/searchDetailsMock";
import { generateLinkService, getSearchDetailsService } from "../services"; // adjust path if needed

vi.mock("@/services/api.service", () => ({
  POST: vi.fn(),
}));

const mockPost = POST as unknown as ReturnType<typeof vi.fn>;

describe("mobile/email verification services", () => {
  it("should call getSearchDetailsService with correct endpoint and payload", async () => {
    mockPost.mockResolvedValueOnce(generateLinkResponseMock);

    const response = await getSearchDetailsService(generateLinkRequestMock);

    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_EMAIL_VERIFICATION_ENDPOINTS.SEARCH_DETAILS,
      generateLinkRequestMock
    );
    expect(response).toEqual(generateLinkResponseMock);
  });

  it("should call generateLinkService with correct endpoint and payload", async () => {
    mockPost.mockResolvedValueOnce(generateVerifyLinkResponse);

    const response = await generateLinkService(generateVerifyLinkRequest);

    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_EMAIL_VERIFICATION_ENDPOINTS.GENERATE_LINK,
      generateVerifyLinkRequest
    );
    expect(response).toEqual(generateVerifyLinkResponse);
  });
});
