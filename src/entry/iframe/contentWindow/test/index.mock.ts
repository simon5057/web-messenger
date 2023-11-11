import { jest } from "@jest/globals";

interface Window {
  parent: ParentWindow;
  location: Location;
}

interface ParentWindow {
  postMessage(message: any, targetOrigin: string): void;
}

interface Location {
  href: string;
}

export function createMockWindow(): Window {
  return {
    parent: {
      postMessage: jest.fn(),
    },
    location: {
      href: "https://test.com",
    },
  };
}
