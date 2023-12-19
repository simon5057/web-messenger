import { describe, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { PING } from "../../../../utils/forTest";

describe("[Worker] Main postMessage error", () => {
  it("Post To Worker", async () => {
    try {
      const messageBridge = registerMain({}, {} as any);
      const callName = "postWorker";
      await messageBridge.postToWorker(callName, PING);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
