import { jest } from "@jest/globals";

const listenerSet: Set<(...args: any) => any> = new Set();
export function createMock(): {
  workerSelf: {
    onmessage: (...args: any[]) => any;
    addEventListener: (...args: any[]) => any;
    removeEventListener: (...args: any[]) => any;
    _mockPostFromMain: (...args: any[]) => any;
  };
  postMessage: () => any;
} {
  return {
    workerSelf: {
      onmessage: jest.fn(),
      addEventListener: (_eventType, handler) => {
        listenerSet.add(handler);
      },
      removeEventListener(_eventType, handler) {
        listenerSet.delete(handler);
      },
      _mockPostFromMain: (data: any) => {
        const event = {
          data,
        };
        for (const l of listenerSet) {
          l(event);
        }
      },
    },
    postMessage: jest.fn(),
  };
}
