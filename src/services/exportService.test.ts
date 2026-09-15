import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportService } from "./exportService";

// Test exportService  CSV/JSON conversion.

describe("exportService", () => {
  beforeEach(() => {
    //  Mock URL.createObjectURL

    globalThis.URL.createObjectURL = vi.fn().mockReturnValue("bolb:mock-url");
    globalThis.URL.revokeObjectURL = vi.fn();

    //  Mock document.createElement

    const mockLink = {
      href: "",
      download: "",
      click: vi.fn(),
    };
    vi.spyOn(document, "createElement").mockReturnValue(mockLink as any);
    vi.spyOn(document.body, "appendChild").mockImplementation(
      () => null as any,
    );

    vi.spyOn(document.body, "removeChild").mockImplementation(
      () => null as any,
    );
  });

  //  Test 1: CSV export with data

  it("exports CSV with valid data", () => {
    const data = [
      { name: "Alpha", spend: 5000 },
      { name: "Beta", spend: 3000 },
    ];

    expect(() => exportService.toCSV(data, "test-export")).not.toThrow();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  // Test 2: CSV export with empty data

  it("does not export CSV with empty data", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    exportService.toCSV([], "test-export");

    expect(consoleSpy).toHaveBeenCalledWith("No data to export");
  });

  // Test 3: JSON export

  it("exports JSON with valid data", () => {
    const data = [{ name: "Alpha", spend: 5000 }];
    expect(() => exportService.toJSON(data, "test-export")).not.toThrow();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });
  // Test 4: Handles strings with commas
  it("handles strings with commas in CSV", () => {
    const data = [{ name: "Alpha, Team", spend: 5000 }];

    expect(() => exportService.toCSV(data, "test-export")).not.toThrow();
  });
});
