import { describe, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { PING } from "../../../../utils/forTest";

describe("Main postMessage Restrictions 2", () => {
  it("Origin: post to specific origin(matched)", () => {
    let iframe = window.document.createElement("iframe");
    iframe.src = "https://www.iframe.com";
    window.document.body.appendChild(iframe);

    const messageBridge = registerMain(
      {},
      {
        iframeDom: iframe,
        postToOrigin: "https://www.iframe.com",
      }
    );
    const callName = "postIframe";
    return new Promise<void>((resolve) => {
      iframe.contentWindow!.addEventListener("message", (e) => {
        expect(e.data.data).toEqual(PING);
        expect(e.data.callName).toEqual(callName);
        resolve();
      });
      messageBridge.postToIframe(callName, PING);
    });
  });

  it("Origin: post to specific origin 2(not matched)", () => {
    let iframe = window.document.createElement("iframe");
    iframe.src = "https://www.iframe.com";
    window.document.body.appendChild(iframe);

    const messageBridge = registerMain(
      {},
      {
        iframeDom: iframe,
        postToOrigin: "https://www.iframe_1.com",
      }
    );
    const callName = "postIframe";
    return new Promise<void>((resolve) => {
      let eventData;
      let eventCallName;
      iframe.contentWindow!.addEventListener("message", (e) => {
        eventData = e.data.data;
        eventCallName = e.data.callName;
      });
      messageBridge.postToIframe(callName, PING);

      setTimeout(() => {
        expect(eventData).toEqual(void 0);
        expect(eventCallName).toEqual(void 0);
        resolve();
      }, 1000);
    });
  });
});
