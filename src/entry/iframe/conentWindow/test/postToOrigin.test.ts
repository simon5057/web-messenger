import { describe, expect, it } from "@jest/globals";
import { registerIframe } from "..";
import { JEST_MOCK_ID, PING } from "../../../../utils/forTest";
import { createMockWindow } from "./index.mock";
import { _setWinForTest } from "../postMessage";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";

describe("Iframe postMessage Restrictions 2", () => {
  it("Origin: post to specific origin", () => {
    const mockWindow: any = createMockWindow();
    _setWinForTest(mockWindow);
    const origin = "https://www.iframe.com";
    const messageBridge = registerIframe(
      {},
      {
        postToOrigin: origin,
      }
    );
    const callName = "postParent";
    const data = PING;
    return new Promise<void>((resolve) => {
      messageBridge.postToParent(callName, data);
      setTimeout(() => {
        const callData: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.REQUEST,
          messageId: JEST_MOCK_ID,
          data,
          callName,
        };
        expect(mockWindow.parent.postMessage).toBeCalledWith(callData, origin);
        resolve();
      }, 100);
    });
  });
});
