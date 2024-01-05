import { describe, beforeEach, expect, it } from "@jest/globals";
import { _setWorkerSelfMockForTest, registerWorker } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PONG } from "../../../../utils/forTest";
import { createMock } from "./index.mock";
import { _setWorkerPostMessageMockForTest } from "../postMessage";

describe("Worker postMessage with transferable data", () => {
  let messageBridge: ReturnType<typeof registerWorker>;
  let _workerSelf;
  let _postMessage;

  beforeEach(() => {
    const { workerSelf, postMessage } = createMock();
    _workerSelf = workerSelf;
    _postMessage = postMessage;
    _setWorkerSelfMockForTest(workerSelf as any);
    _setWorkerPostMessageMockForTest(postMessage);
    messageBridge = registerWorker({
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
    _workerSelf._mockPostFromMain(msg);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const res: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: msg.messageId,
          data,
        };

        expect(_postMessage).toBeCalledWith(res, { transfer: [data] });
        resolve();
      }, 100);
    });
  });

  it("Post To Main transferable", () => {
    const callName = "postMainTransferable";
    const data = new ArrayBuffer(1);
    data[0] = 0;
    messageBridge.postToMainTransferable(callName, data, [data]);

    const lastCall = _postMessage.mock.lastCall[0];
    const callData: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      messageId: lastCall.messageId,
      callName,
      data,
    };
    expect(_postMessage).toBeCalledWith(callData, { transfer: [data] });
  });

  it("Post To Main transferable: Await Response", () => {
    const callName = "postMain";
    const data = new ArrayBuffer(1);
    data[0] = 0;

    return new Promise<void>((resolve) => {
      messageBridge
        .postToMainTransferableAwaitResponse(callName, data, [data])
        .then((r) => {
          expect(r).toEqual(PONG);
          resolve();
        });
      const lastCall = _postMessage.mock.lastCall[0];
      const callData: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        messageId: lastCall.messageId,
        callName,
        data,
      };
      expect(_postMessage).toBeCalledWith(callData, { transfer: [data] });

      const response: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.RESPONSE,
        messageId: callData.messageId,
        data: PONG,
      };
      setTimeout(() => {
        _workerSelf._mockPostFromMain(response);
      });
    });
  });
});
