import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING } from "../../../../utils/forTest";
import { hasIframe } from "../postMessage";

describe("Main postMessage cleanup", () => {
  let iframe: HTMLIFrameElement;
  let messageBridge: ReturnType<typeof registerMain>;
  let notReceiveData;

  beforeEach(() => {
    iframe = window.document.createElement("iframe");
    window.document.body.appendChild(iframe);
    messageBridge = registerMain(
      {
        isCleanup(data) {
          notReceiveData = data;
        },
      },
      {
        iframeDom: iframe,
      }
    );
  });

  it("Cleanup", () => {
    messageBridge.cleanup();
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "isCleanup",
      messageId: "1",
      data: PING,
    };
    iframe.contentWindow!.parent.postMessage(msg, "*");

    return new Promise<void>((resolve) => {
      expect(hasIframe()).toBe(false);
      expect(notReceiveData).toBe(void 0);
      resolve();
    });
  });
});
