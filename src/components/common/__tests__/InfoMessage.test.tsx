import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import InfoMessage from "../InfoMessage";

// Mock the translator function
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => `translated:${key}`,
}));

describe("InfoMessage", () => {
  const iconSrc = "test-icon.svg";
  const messageKey = "reKYC.infoMessage";

  test("renders icon with correct src and alt", () => {
    render(<InfoMessage icon={iconSrc} message={messageKey} />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", iconSrc);
    expect(img).toHaveAttribute("alt", "info");
  });

  test("renders translated message", () => {
    render(<InfoMessage icon={iconSrc} message={messageKey} />);
    expect(screen.getByText(`translated:${messageKey}`)).toBeInTheDocument();
  });

  test("renders icon and message inside a container with correct classes", () => {
    render(<InfoMessage icon={iconSrc} message={messageKey} />);
    const container = screen
      .getByText(`translated:${messageKey}`)
      .closest("div");

    expect(container).toHaveClass(
      "font-normal",
      "text-sm",
      "flex",
      "items-center",
      "gap-x-1"
    );
  });
});
