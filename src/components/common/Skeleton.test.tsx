import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  //  Test 1: Default render
  it("renders with default props", () => {
    const { container } = render(<Skeleton />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse");
    expect(skeleton).toHaveClass("bg-gray-200");
  });

  // Test 2: Custom width and height

  it("applies custom width and height", () => {
    const { container } = render(<Skeleton width={200} height={50} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton.style.width).toBe("200px");
    expect(skeleton.style.height).toBe("50px");
  });

  //  Test 3: Circular variant
  it("applies circular variant classes", () => {
    const { container } = render(<Skeleton variant="circular" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("rounded-full");
  });

  // Test 4: Rounded variant
  it("applies rounded variant classes", () => {
    const { container } = render(<Skeleton variant="rounded" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("rounded-lg");
  });

  //  Test 5: Custom className
  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-class" />);

    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass("custom-class");
  });
});
