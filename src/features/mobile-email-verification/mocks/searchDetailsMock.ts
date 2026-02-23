// search-details

export const generateLinkRequestMock = {
  email: "piyushjn35@gmail.com", // optional
  mobile: "7066924084", // optional
};

export const generateLinkResponseMock = {
  statusCode: 200,
  status: "OK",
  message: "details fetched",
  data: {
    mobile: "9999999999",
    lastVerificationPerformed: "2025-08-18 14:47:52.850 +0530",
    verificationStatus: true,
  },
};

export const generatelinkResponseMockVerificationDone = {
  statusCode: 200,
  status: "OK",
  message: "details fetched",
  data: {
    mobile: "",
    lastVerificationPerformed: "2025-08-18 14:47:52.850 +0530",
    verificationStatus: false,
  },
};

export const generateLinkResponseMockFirstTime = {
  statusCode: 200,
  status: "OK",
  message: "No data found",
  data: null,
};
