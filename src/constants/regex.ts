// Regex constants for validating various inputs

// below is refer as example
export const ALPHANUMERIC_UNDERSCORE_HYPHEN = /^[a-zA-Z0-9_-]+$/;

export const MOBILE_NUMBER_REGEX = /^\d{10}$/;

export const CIF_LENGTH_REGEX = /^\d{9}$/;

export const ACCOUNT_NUMBER_REGEX = /^\d{14}$/;

export const VALID_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
