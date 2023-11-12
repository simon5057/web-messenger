import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerIframe } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING } from "../../../../utils/forTest";
import { postMessageMock } from "../../../../mock/postMessage.mock";

describe("Iframe postMessage cleanup", () => {
  let messageBridge: ReturnType<typeof registerIframe>;
  let notReceiveData;

  beforeEach(() => {
    messageBridge = registerIframe({
      isCleanup(data) {
        notReceiveData = data;
      },
    });
  });

  it("Cleanup", () => {
    messageBridge.cleanup();
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "isCleanup",
      messageId: "1",
      data: PING,
    };
    postMessageMock(msg, "*");

    return new Promise<void>((resolve) => {
      expect(notReceiveData).toBe(void 0);
      resolve();
    });
  });
});
