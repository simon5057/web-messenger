import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING, PONG } from "../../../../utils/forTest";
import { createMockWorker } from "./index.mock";

describe("[Worker] Main postMessage", () => {
  let worker = createMockWorker() as any;
  let messageBridge: ReturnType<typeof registerMain>;
  let ping;

  beforeEach(() => {
    messageBridge = registerMain(
      {
        ping(data) {
          ping = data;
          return PONG;
        },
      },
      {
        worker,
      }
    );
  });

  it("MessageDispatcher: ping pong", () => {
    const data = PING;
    const callName = "ping";
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName,
      messageId: "1",
      data,
    };
    worker._mockPostFromWorker(msg);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(ping).toEqual(data);
        const calls = worker.postMessage.mock.lastCall[0];
        const callData: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: calls.messageId,
          data: PONG,
        };
        expect(worker.postMessage).toBeCalledWith(callData);
        resolve();
      }, 100);
    });
  });

  it("Post To Worker", () => {
    const callName = "postWorker";
    messageBridge.postToWorker(callName, PING);
    return new Promise<void>((resolve) => {
      const calls = worker.postMessage.mock.lastCall[0];
      const callData: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        messageId: calls.messageId,
        data: PING,
        callName,
      };
      expect(worker.postMessage).toBeCalledWith(callData);
      resolve();
    });
  });

  it("Post To Worker: Await Response", () => {
    const callName = "postWorker";
    return new Promise<void>((resolve) => {
      messageBridge.postToWorkerAwaitResponse(callName, PING).then((data) => {
        expect(data).toEqual(PONG);
        resolve();
      });
      const calls = worker.postMessage.mock.lastCall[0];
      const data = PONG;
      const msg: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.RESPONSE,
        messageId: calls.messageId,
        data,
      };
      worker._mockPostFromWorker(msg);
    });
  });
});
