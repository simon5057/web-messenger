import { describe, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { PING } from "../../../../utils/forTest";

describe("Main postMessage error", () => {
  it("Post To Iframe", async () => {
    try {
      const messageBridge = registerMain({});
      const callName = "postIframe";
      await messageBridge.postToIframe(callName, PING);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
