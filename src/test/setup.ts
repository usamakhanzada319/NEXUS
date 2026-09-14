import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// cleanup After Every test
afterEach(() => {
  cleanup(); //rendered components remove from DOM
});
//Agar cleanup na ho, toh tests ek dusre ko affect karenge

const localStorageMock = {
  // vi.fn() not doing any thing just for tracking

  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
//  localStorage not exist in jsdom
// Test mein localStorage use karna ho toh mock chahiye
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

//  Mock matchMedia //Browser API jo media queries check karta hai
// for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver //Browser API jo element visibility detect karta hai
// for lazy loading

globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), //observe Element
  unobserve: vi.fn(), //un-observe Element
  disconnect: vi.fn(), // shutDown Observer
}));

// Mock ResizeObserver
//for responsive
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
