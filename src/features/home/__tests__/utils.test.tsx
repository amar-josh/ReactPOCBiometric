import { describe, expect, it } from "vitest";

import dailpad from "@/assets/images/dialpad.svg";
import id from "@/assets/images/id.svg";
import kyc from "@/assets/images/kyc.svg";
import map from "@/assets/images/map.svg";

import { DASHBOARD_KEYS } from "../../re-kyc/constants";
import { getIconBasedOnModuleKey, homeListJson } from "../utils";

describe("getIconBasedOnModuleKey", () => {
  it("returns dialpad icon for MOBILE_NUMBER_UPDATE", () => {
    expect(getIconBasedOnModuleKey(DASHBOARD_KEYS.MOBILE_NUMBER_UPDATE)).toBe(
      dailpad
    );
  });

  it("returns map icon for ADDRESS_UPDATE", () => {
    expect(getIconBasedOnModuleKey(DASHBOARD_KEYS.ADDRESS_UPDATE)).toBe(map);
  });

  it("returns id icon for PAN_UPDATE", () => {
    expect(getIconBasedOnModuleKey(DASHBOARD_KEYS.PAN_UPDATE)).toBe(id);
  });

  it("returns kyc icon for RE_KYC", () => {
    expect(getIconBasedOnModuleKey(DASHBOARD_KEYS.RE_KYC)).toBe(kyc);
  });

  it("returns empty string for unknown moduleKey", () => {
    expect(getIconBasedOnModuleKey("UNKNOWN_KEY")).toBe("");
  });
});

describe("homeListJson", () => {
  it("contains 4 items", () => {
    expect(homeListJson.length).toBe(4);
  });

  it("each item has label, icon and description", () => {
    for (const item of homeListJson) {
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("icon");
      expect(item).toHaveProperty("description");
    }
  });

  it("includes specific labels", () => {
    const labels = homeListJson.map((item) => item.label);
    expect(labels).toContain("Mobile Number Update");
    expect(labels).toContain("Address Update");
    expect(labels).toContain("PAN Number Update");
    expect(labels).toContain("Re-KYC Update");
  });
});
