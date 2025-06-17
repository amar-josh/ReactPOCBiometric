import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import HomeComponent from "../component/HomePage"; // Adjust if path differs

// Mocks
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => {
    const translations: Record<string, string> = {
      "home.welcome": "Welcome",
      "home.subTitle": "Choose a service to continue",
    };
    return translations[key] || key;
  },
}));

vi.mock("@/components/common/HomePageCard", () => ({
  default: ({ moduleKey, label, description, onHandleClick }: any) => (
    <div data-testid={`card-${moduleKey}`}>
      <h3>{label}</h3>
      <p>{description}</p>
      <button onClick={onHandleClick}>Go</button>
    </div>
  ),
}));

vi.mock("@/components/common/AlertMessage", () => ({
  default: ({ type, message }: any) => (
    <div data-testid="alert">
      {type}: {message}
    </div>
  ),
}));

vi.mock("../utils", () => ({
  getIconBasedOnModuleKey: (key: string) => `icon-for-${key}`,
}));

describe("HomeComponent", () => {
  const mockClick = vi.fn();

  const mockModules = [
    {
      moduleKey: "aadhaar",
      moduleName: "Aadhaar Update",
      moduleDesc: "Update your Aadhaar card",
    },
    {
      moduleKey: "pan",
      moduleName: "PAN Services",
      moduleDesc: "Apply for PAN card",
    },
  ];

  const mockAlert = {
    type: "error",
    message: "Something went wrong",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders welcome message and subtitle", () => {
    render(
      <HomeComponent
        onHandleClick={mockClick}
        instaServices={mockModules}
        alertMessage={{ type: "", message: "" }}
      />
    );

    expect(screen.getByText(/👋/)).toBeInTheDocument();
    expect(
      screen.getByText("Choose a service to continue")
    ).toBeInTheDocument();
  });

  it("renders service cards based on instaServices", () => {
    render(
      <HomeComponent
        onHandleClick={mockClick}
        instaServices={mockModules}
        alertMessage={{ type: "", message: "" }}
      />
    );

    expect(screen.getByTestId("card-aadhaar")).toBeInTheDocument();
    expect(screen.getByTestId("card-pan")).toBeInTheDocument();
  });

  it("calls onHandleClick when a card button is clicked", () => {
    render(
      <HomeComponent
        onHandleClick={mockClick}
        instaServices={mockModules}
        alertMessage={{ type: "", message: "" }}
      />
    );

    fireEvent.click(screen.getAllByText("Go")[0]);
    expect(mockClick).toHaveBeenCalled();
  });

  it("shows alert message when alertMessage.message exists", () => {
    render(
      <HomeComponent
        onHandleClick={mockClick}
        instaServices={mockModules}
        alertMessage={mockAlert}
      />
    );

    expect(screen.getByTestId("alert")).toHaveTextContent(
      "error: Something went wrong"
    );
  });
});
