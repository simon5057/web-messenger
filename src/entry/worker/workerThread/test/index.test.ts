import { describe, beforeEach, expect, it } from "@jest/globals";
import { _setWorkerSelfMockForTest, registerWorker } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING, PONG } from "../../../../utils/forTest";
import { createMock } from "./index.mock";
import { _setWorkerPostMessageMockForTest } from "../postMessage";

describe("Worker postMessage", () => {
  let messageBridge: ReturnType<typeof registerWorker>;
  let ping;
  let _workerSelf;
  let _postMessage;

  beforeEach(() => {
    const { workerSelf, postMessage } = createMock();
    _workerSelf = workerSelf;
    _postMessage = postMessage;
    _setWorkerSelfMockForTest(workerSelf);
    _setWorkerPostMessageMockForTest(postMessage);
    messageBridge = registerWorker({
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
    _workerSelf._mockPostFromMain(msg);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const res: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: msg.messageId,
          data: PONG,
        };

        expect(ping).toEqual(data);
        expect(_postMessage).toBeCalledWith(res);
        resolve();
      }, 100);
    });
  });

  it("Post To Main", () => {
    const callName = "postMain";
    messageBridge.postToMain(callName, PING);

    const lastCall = _postMessage.mock.lastCall[0];
    const callData: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      messageId: lastCall.messageId,
      callName,
      data: PING,
    };
    expect(_postMessage).toBeCalledWith(callData);
  });

  it("Post To Main: Await Response", () => {
    const callName = "postMain_1";

    return new Promise<void>((resolve) => {
      messageBridge.postToMainAwaitResponse(callName, PING).then((res) => {
        expect(res).toEqual(PONG);
        resolve();
      });
      const lastCall = _postMessage.mock.lastCall[0];
      const callData: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        messageId: lastCall.messageId,
        callName,
        data: PING,
      };
      expect(_postMessage).toBeCalledWith(callData);

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
