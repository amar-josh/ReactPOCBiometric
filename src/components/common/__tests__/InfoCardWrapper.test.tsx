import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RadioGroup } from "@/components/ui/radio-group";

import CardWrapper from "../InfoCardWrapper";

describe("CardWrapper", () => {
  const onSelectMock = vi.fn();

  const defaultProps = {
    children: <div>Child Content</div>,
    withRadio: false,
    radioValue: "radio1",
    title: "Test Title",
    subTitle: "Sub Title",
    subTitleInfo: "Sub Info",
    onSelect: vi.fn(),
    backgroundColor: "bg-white",
    selected: false,
  };

  beforeEach(() => {
    defaultProps.onSelect.mockClear?.();
  });

  it("renders children content", () => {
    render(<CardWrapper {...defaultProps} />);
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders title and subtitles", () => {
    render(<CardWrapper {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subTitle)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subTitleInfo)).toBeInTheDocument();
  });

  it("renders CardHeader with RadioGroupItem and Label when withRadio and radioValue are provided", () => {
    render(
      <RadioGroup value="radio1" onValueChange={() => {}}>
        <CardWrapper
          withRadio={true}
          radioValue="radio1"
          title="Card Title"
          subTitle="Subtitle"
          subTitleInfo="Additional info"
          onSelect={onSelectMock}
        >
          <p>Child content</p>
        </CardWrapper>
      </RadioGroup>
    );

    // Radio input present
    const radioInput = screen.getByRole("radio");
    expect(radioInput).toBeInTheDocument();
    expect(radioInput).toHaveAttribute("value", "radio1");

    // Label with title present and linked to radioValue
    const label = screen.getByText("Card Title");
    expect(label).toBeInTheDocument();
    expect(label.closest("label")).toHaveAttribute("for", "radio1");

    // Subtitles rendered correctly
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
    expect(screen.getByText("Additional info")).toBeInTheDocument();

    // onSelect called when header clicked (click on label's parent div)
    const headerDiv = label.closest("div");
    expect(headerDiv).toBeInTheDocument();
    if (headerDiv) {
      fireEvent.click(headerDiv);
      expect(onSelectMock).toHaveBeenCalledTimes(1);
    }
  });

  it("renders radio button when withRadio is true and radioValue is provided", () => {
    render(
      <RadioGroup value={defaultProps.radioValue} onValueChange={() => {}}>
        <CardWrapper {...defaultProps} withRadio={true} />
      </RadioGroup>
    );
    const radio = screen.getByRole("radio");
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute("value", defaultProps.radioValue);
  });

  it("does not render radio button when withRadio is false", () => {
    render(<CardWrapper {...defaultProps} withRadio={false} />);
    const radios = screen.queryAllByRole("radio");
    expect(radios.length).toBe(0);
  });

  it("calls onSelect when CardHeader is clicked", () => {
    render(
      <RadioGroup value={defaultProps.radioValue} onValueChange={() => {}}>
        <CardWrapper {...defaultProps} withRadio={true} />
      </RadioGroup>
    );
    const header = screen.getByText(defaultProps.title).closest("div");
    expect(header).toBeInTheDocument();
    if (header) {
      fireEvent.click(header);
    }
    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it("applies selected background color class when selected is true", () => {
    const { container } = render(
      <CardWrapper {...defaultProps} selected={true} />
    );
    expect(container.firstChild).toHaveClass("bg-info-background");
  });

  it("applies default background color class when selected is false", () => {
    const { container } = render(
      <CardWrapper {...defaultProps} selected={false} />
    );
    expect(container.firstChild).toHaveClass(defaultProps.backgroundColor);
  });

  it("does not render CardHeader and Separator when neither withRadio nor title are provided", () => {
    render(
      <CardWrapper {...defaultProps} withRadio={false} title={undefined} />
    );
    // CardHeader should not exist
    expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument();
    // Separator div should not exist, check for role separator or class
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });
});
