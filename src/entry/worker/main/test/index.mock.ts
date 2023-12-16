import { jest } from "@jest/globals";

interface Worker {
  onmessage: (data: any) => void;
  postMessage: (data: any) => void;
  addEventListener: (eventType: "message", handler: (data: any) => void) => any;
  removeEventListener: (
    eventType: "message",
    handler: (data: any) => void
  ) => any;
  _mockPostFromWorker: (data: any) => void;
}

const listenerSet: Set<(...args: any) => any> = new Set();
export function createMockWorker(): Worker {
  return {
    onmessage: jest.fn(),
    addEventListener: (_eventType, handler) => {
      listenerSet.add(handler);
    },
    removeEventListener(_eventType, handler) {
      listenerSet.delete(handler);
    },
    postMessage: jest.fn(),
    _mockPostFromWorker: (data: any) => {
      const event = {
        data,
      };
      for (const l of listenerSet) {
        l(event);
      }
    },
  };
}
