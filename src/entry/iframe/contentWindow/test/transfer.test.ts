import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerIframe } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PONG } from "../../../../utils/forTest";
import { createMockWindow } from "./index.mock";
import { _setWinForTest } from "../postMessage";
import { postMessageMock } from "../../../../mock/postMessage.mock";

describe("Iframe postMessage with transferable data", () => {
  let mockWindow;
  let messageBridge: ReturnType<typeof registerIframe>;

  beforeEach(() => {
    mockWindow = createMockWindow();
    _setWinForTest(mockWindow);
    messageBridge = registerIframe({
      pingTransferable(from) {
        return [from, [from]];
      },
    });
  });

  it("MessageDispatcher Transferable: receive and response", () => {
    const data = new ArrayBuffer(1);
    data[0] = 0;
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "pingTransferable",
      messageId: "1",
      data,
    };
    postMessageMock(msg);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const res: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: msg.messageId,
          data,
        };

        expect(mockWindow.parent.postMessage).toBeCalledWith(res, "*", [data]);
        resolve();
      }, 100);
    });
  });

  it("Post To Parent transferable", () => {
    const callName = "postParentTransferable";
    const data = new ArrayBuffer(1);
    data[0] = 0;
    messageBridge.postToParentTransferable(callName, data, [data]);

    const calls = mockWindow.parent.postMessage.mock.calls[0];
    const callData: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      messageId: calls[0].messageId,
      callName,
      data,
    };
    expect(mockWindow.parent.postMessage).toBeCalledWith(callData, "*", [data]);
  });

  it("Post To Parent transferable: Await Response", () => {
    const callName = "postParent";
    const data = new ArrayBuffer(1);
    data[0] = 0;

    return new Promise<void>((resolve) => {
      messageBridge
        .postToParentTransferableAwaitResponse(callName, data, [data])
        .then((res) => {
          expect(res).toEqual(PONG);
          resolve();
        });
      const calls = mockWindow.parent.postMessage.mock.calls[0];
      const callData: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        messageId: calls[0].messageId,
        callName,
        data,
      };
      expect(mockWindow.parent.postMessage).toBeCalledWith(callData, "*", [
        data,
      ]);

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
