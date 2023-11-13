import { describe, expect, it } from "@jest/globals";
import { registerIframe } from "..";
import { PING } from "../../../../utils/forTest";

describe("Iframe postMessage error", () => {
  it("Not in Iframe", async () => {
    const messageBridge = registerIframe({});
    try {
      await messageBridge.postToParent("callName", PING);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
