export const ROUTES = {
  LOGIN: "/login",
  ADFS_AUTH: "/auth",
  HOME: "/home",
  RE_KYC: "/re-kyc",
  MOBILE_NUMBER_UPDATE: "/mobile-number-update",
  MOBILE_EMAIL_VERIFICATION: "/mobile-email-verification",
  UNAUTHORIZED: "/unauthorized",
  SESSION_EXPIRED: "/session-expired",
  PAGE_NOT_FOUND: "*",
} as const;

export const PRIVATE_ROUTES = [
  ROUTES.RE_KYC,
  ROUTES.MOBILE_EMAIL_VERIFICATION,
  ROUTES.MOBILE_NUMBER_UPDATE,
  ROUTES.HOME,
] as const;
