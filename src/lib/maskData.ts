export type MaskType = "mobile" | "aadhaar" | "customerId" | "email";

export function maskData(value: string, type: MaskType): string {
  if (!value) return "";

  switch (type) {
    case "mobile":
    case "aadhaar":
    case "customerId": {
      const visible = value.slice(-4);
      const masked = "X".repeat(value?.length > 4 ? value.length - 4 : 0);
      return masked + visible;
    }

    case "email": {
      const [name, domain] = value.split("@");
      if (!name || !domain) return value;

      const visible = name.slice(0, 3);
      const masked = "X".repeat(Math.max(name.length - 3, 0));
      return `${visible}${masked}@${domain}`;
    }

    default:
      return value;
  }
}
