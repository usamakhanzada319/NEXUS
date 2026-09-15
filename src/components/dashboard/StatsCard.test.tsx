import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils";

import { StatsCard } from "./StatsCard";
import { DollarSign } from "lucide-react";

describe("StatsCard", () => {
  const defaultProps = {
    title: "Total Spend",
    value: "$24,500",
    change: "+12.5%",
    icon: <DollarSign data-testid="icon" />,
    color: "blue" as const,
  };

  //test 1: Component renders
  it("renders the title and value correctly", () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByText("Total Spend")).toBeInTheDocument();
    expect(screen.getByText("$24,500")).toBeInTheDocument();
  });

  //  Test 2: Change badge renders
  it("renders the change badge when provided", () => {
    render(<StatsCard {...defaultProps} />);

    expect(screen.getByText("+12.5%")).toBeInTheDocument();
  });

  // Test 3: Positive change has green color
  it("applies green color for positive change", () => {
    render(<StatsCard {...defaultProps} />);

    const changeElement = screen.getByText("+12.5%");
    expect(changeElement).toHaveClass("text-green-600");
  });

  //  Test 4: Negative change has red color
  it("applies red color for negative change", () => {
    render(<StatsCard {...defaultProps} change="-5.2%" />);

    const changeElement = screen.getByText("-5.2%");
    expect(changeElement).toHaveClass("text-red-600");
  });
  //  Test 5: Loading state renders skeleton
  it("renders skeleton when loading is true", () => {
    const { container } = render(<StatsCard {...defaultProps} loading />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  //  Test 6: Icon renders
  it("renders the icon", () => {
    render(<StatsCard {...defaultProps} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  //  Test 7: No change badge when not provided
  it("does not render change badge when change is not provided", () => {
    render(<StatsCard {...defaultProps} change={undefined} />);

    expect(screen.queryByText("+12.5%")).not.toBeInTheDocument();
  });
});
