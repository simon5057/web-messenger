import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerIframe } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING, PONG } from "../../../../utils/forTest";
import { createMockWindow } from "./index.mock";
import { _setWinForTest } from "../postMessage";
import { postMessageMock } from "../../../../mock/postMessage.mock";

describe("Iframe postMessage", () => {
  let mockWindow;
  let messageBridge: ReturnType<typeof registerIframe>;
  let ping;

  beforeEach(() => {
    mockWindow = createMockWindow();
    _setWinForTest(mockWindow);
    messageBridge = registerIframe({
      ping(data) {
        ping = data;
        return PONG;
      },
    });
  });

  it("MessageDispatcher: ping pong", () => {
    const data = PING;
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "ping",
      messageId: "1",
      data,
    };
    postMessageMock(msg);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const res: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: msg.messageId,
          data: PONG,
        };

        expect(ping).toEqual(data);
        expect(mockWindow.parent.postMessage).toBeCalledWith(res, "*");
        resolve();
      }, 100);
    });
  });

  it("Post To Parent", () => {
    const callName = "postParent";
    messageBridge.postToParent(callName, PING);

    const calls = mockWindow.parent.postMessage.mock.calls[0];
    const callData: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      messageId: calls[0].messageId,
      callName,
      data: PING,
    };
    expect(mockWindow.parent.postMessage).toBeCalledWith(callData, "*");
  });

  it("Post To Parent: Await Response", () => {
    const callName = "postParent_1";

    return new Promise<void>((resolve) => {
      messageBridge.postToParentAwaitResponse(callName, PING).then((res) => {
        expect(res).toEqual(PONG);
        resolve();
      });
      const calls = mockWindow.parent.postMessage.mock.calls[0];
      const callData: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        messageId: calls[0].messageId,
        callName,
        data: PING,
      };
      expect(mockWindow.parent.postMessage).toBeCalledWith(callData, "*");

      const response: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.RESPONSE,
        messageId: callData.messageId,
        data: PONG,
      };
      setTimeout(() => {
        postMessageMock(response, "*");
      });
    });
  });
});
