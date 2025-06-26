export const ROUTES = {
  LOGIN: "/login",
  HOME: "/home",
  RE_KYC: "/re-kyc",
  MOBILE_NUMBER_UPDATE: "/mobile-number-update",
  VERIFY_LINK: "/verify",
  UNAUTHORIZED: "/UNAUTHORIZED",
  SESSION_EXPIRED: "/session-expired",
  PAGE_NOT_FOUND: "*",
} as const;

export const PRIVATE_ROUTES = [
  ROUTES.RE_KYC,
  ROUTES.MOBILE_NUMBER_UPDATE,
  ROUTES.HOME,
] as const;
