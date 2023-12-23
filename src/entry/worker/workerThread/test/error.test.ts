import { describe, expect, it } from "@jest/globals";
import { registerWorker } from "..";
import { PING } from "../../../../utils/forTest";

describe("Worker postMessage error", () => {
  it("Not in Worker", async () => {
    const messageBridge = registerWorker({});
    try {
      await messageBridge.postToMain("callName", PING);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
