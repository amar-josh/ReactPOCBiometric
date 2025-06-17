import { render, screen } from "@testing-library/react";
import React from "react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Wrapper component for testing
const TestForm = ({ defaultValues = { email: "" }, errors = false }) => {
  const methods = useForm({
    defaultValues,
    mode: "onSubmit",
  });

  return (
    <Form {...methods}>
      <form>
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormDescription>This is your work email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

describe("Form components", () => {
  it("renders FormLabel, Input, Description", () => {
    render(<TestForm />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByText("This is your work email.")).toBeInTheDocument();
  });

  it("shows error message when field has error", async () => {
    const defaultValues = { email: "" };

    const TestFormWithError = () => {
      const methods = useForm({
        defaultValues,
        mode: "onSubmit",
      });

      // Simulate error manually
      React.useEffect(() => {
        methods.setError("email", {
          type: "manual",
          message: "Email is required",
        });
      }, [methods]);

      return (
        <Form {...methods}>
          <form>
            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormDescription>This is your work email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
    };

    render(<TestFormWithError />);

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("applies correct slot attributes", () => {
    render(<TestForm />);

    expect(screen.getByText("Email")).toHaveAttribute(
      "data-slot",
      "form-label"
    );
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "data-slot",
      "form-control"
    );
    expect(screen.getByText("This is your work email.")).toHaveAttribute(
      "data-slot",
      "form-description"
    );
  });

  it("does not render FormMessage when there's no error", () => {
    render(<TestForm />);

    const message = screen.queryByTestId("form-message");
    expect(message).toBeNull(); // Not rendered
  });
});
