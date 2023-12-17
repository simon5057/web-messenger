import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING } from "../../../../utils/forTest";
import { hasWorker } from "../postMessage";
import { createMockWorker } from "./index.mock";

describe("[Worker] Main postMessage cleanup", () => {
  const worker = createMockWorker() as any;
  let messageBridge: ReturnType<typeof registerMain>;
  let notReceiveData;

  beforeEach(() => {
    messageBridge = registerMain(
      {
        isCleanup(data) {
          notReceiveData = data;
        },
      },
      {
        worker,
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
    worker._mockPostFromWorker(msg);
    return new Promise<void>((resolve) => {
      expect(hasWorker()).toBe(false);
      expect(notReceiveData).toBe(void 0);
      resolve();
    });
  });
});
