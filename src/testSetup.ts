import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi
    .fn()
    .mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
});
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
if (!window.ResizeObserver)
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
if (!window.PointerEvent)
  window.PointerEvent = MouseEvent as typeof PointerEvent;
HTMLElement.prototype.hasPointerCapture = () => false;
HTMLElement.prototype.setPointerCapture = () => {};
HTMLElement.prototype.releasePointerCapture = () => {};
beforeEach(() => {
  window.history.replaceState(null, "", "#/");
  vi.clearAllMocks();
});
afterEach(cleanup);
