// postMessage.mock.js
export function postMessageMock(message, origin) {
  const event = {
    data: message,
    origin,
  };

  window.dispatchEvent(new MessageEvent("message", event));
}
