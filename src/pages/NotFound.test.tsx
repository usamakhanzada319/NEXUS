import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test/utils";
import { NotFound } from "./NotFound";

// Test NotFound page ka behaviour.

//Mock useNavigate

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("NotFound", () => {
  // Test 1: Renders 404
  it("renders 404 text", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  //  Test 2: Renders action buttons
  it("renders action buttons", () => {
    render(<NotFound />);

    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it('navigates to dashboard when "Go to Dashboard"is clicked', () => {
    render(<NotFound />);

    fireEvent.click(screen.getByText("Go to Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // Test 4: Navigate back on click

  it('navigates back when "Go Back" is clicked', () => {
    render(<NotFound />);
    fireEvent.click(screen.getByText("Go Back"));
    expect(mockNavigate).toHaveBeenCalledWith("-1");
  });
});
