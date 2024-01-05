import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PONG } from "../../../../utils/forTest";
import { createMockWorker } from "./index.mock";

describe("[Worker] Main postMessage with transferable data", () => {
  let worker = createMockWorker() as any;
  let messageBridge: ReturnType<typeof registerMain>;

  beforeEach(() => {
    messageBridge = registerMain(
      {
        pingTransferable(from) {
          return [from, [from]];
        },
      },
      {
        worker,
      }
    );
  });

  it("MessageDispatcher Transferable: receive and response", () => {
    const data = new ArrayBuffer(1);
    data[0] = 0;
    const callName = "pingTransferable";
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName,
      messageId: "1",
      data,
    };
    worker._mockPostFromWorker(msg);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const calls = worker.postMessage.mock.lastCall[0];
        const callData: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: calls.messageId,
          data,
        };
        expect(worker.postMessage).toBeCalledWith(callData, {
          transfer: [data],
        });
        resolve();
      }, 100);
    });
  });

  it("Post To Worker transferable", () => {
    const callName = "postWorkerTransferable";
    const data = new ArrayBuffer(1);
    data[0] = 0;
    messageBridge.postToWorkerTransferable(callName, data, [data]);
    return new Promise<void>((resolve) => {
      const calls = worker.postMessage.mock.lastCall[0];
      const callData: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        messageId: calls.messageId,
        data,
        callName,
      };
      expect(worker.postMessage).toBeCalledWith(callData, { transfer: [data] });
      resolve();
    });
  });

  it("Post To Worker transferable: Await Response", () => {
    const callName = "postWorker";
    const data = new ArrayBuffer(1);
    data[0] = 0;
    return new Promise<void>((resolve) => {
      messageBridge
        .postToWorkerTransferableAwaitResponse(callName, data, [data])
        .then((r) => {
          expect(r).toEqual(PONG);
          resolve();
        });
      const calls = worker.postMessage.mock.lastCall[0];
      const msg: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.RESPONSE,
        messageId: calls.messageId,
        data: PONG,
      };
      worker._mockPostFromWorker(msg);
    });
  });
});
