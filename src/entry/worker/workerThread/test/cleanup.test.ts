import { describe, beforeEach, expect, it } from "@jest/globals";
import { _setWorkerSelfMockForTest, registerWorker } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING } from "../../../../utils/forTest";
import { createMock } from "./index.mock";
import { _setWorkerPostMessageMockForTest } from "../postMessage";

describe("Worker postMessage cleanup", () => {
  let _workerSelf;
  let messageBridge: ReturnType<typeof registerWorker>;
  let notReceiveData;

  beforeEach(() => {
    const { workerSelf, postMessage } = createMock();
    _workerSelf = workerSelf;
    _setWorkerSelfMockForTest(workerSelf as any);
    _setWorkerPostMessageMockForTest(postMessage);
    messageBridge = registerWorker({
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
    _workerSelf._mockPostFromMain(msg);

    return new Promise<void>((resolve) => {
      expect(notReceiveData).toBe(void 0);
      resolve();
    });
  });
});
