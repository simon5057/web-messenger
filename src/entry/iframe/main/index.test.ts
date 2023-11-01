import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerMain } from ".";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../message/types";
import { PING, PONG } from "../../../utils/forTest";

describe("Main postMessage", () => {
  let iframe: HTMLIFrameElement;
  let messageBridge: ReturnType<typeof registerMain>;
  let ping;

  beforeEach(() => {
    iframe = window.document.createElement("iframe");
    window.document.body.appendChild(iframe);
    messageBridge = registerMain(
      {
        ping(data) {
          ping = data;
          return PONG;
        },
      },
      {
        iframeDom: iframe,
      }
    );
  });

  it("MessageDispatcher: ping pong", () => {
    const data = PING;
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "ping",
      messageId: "1",
      data,
    };
    iframe.contentWindow!.parent.postMessage(msg, "*");

    return new Promise<void>((resolve) => {
      iframe.contentWindow!.addEventListener("message", (e) => {
        expect(e.data.data).toEqual(PONG);
        expect(ping).toEqual(data);
        resolve();
      });
    });
  });

  it("Post To Iframe", () => {
    const callName = "postIframe";
    return new Promise<void>((resolve) => {
      iframe.contentWindow!.addEventListener("message", (e) => {
        expect(e.data.data).toEqual(PING);
        expect(e.data.messageType).toEqual(MESSAGE_TYPE.REQUEST);
        expect(e.data.callName).toEqual(callName);
        expect(e.data.messageId).toBeDefined();
        resolve();
      });
      messageBridge.postToIframe(callName, PING);
    });
  });

  it("Post To Iframe: Await Response", () => {
    const callName = "postIframe";
    return new Promise<void>((resolve) => {
      iframe.contentWindow!.addEventListener("message", (e) => {
        const data = PONG;
        const msg: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: e.data.messageId,
          data,
        };
        iframe.contentWindow!.parent.postMessage(msg, "*");
      });
      messageBridge.postToIframeAwaitResponse(callName, PING).then((data) => {
        expect(data).toEqual(PONG);
        resolve();
      });
    });
  });
});
