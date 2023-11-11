import { describe, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING } from "../../../../utils/forTest";
import { postMessageMock } from "../../../../mock/postMessage.mock";

describe("Main postMessage Restrictions 1", () => {
  it("Origin: White List", () => {
    const origin = "https://www.iframe.com";
    let iframe = window.document.createElement("iframe");
    iframe.src = origin;
    window.document.body.appendChild(iframe);

    let inWhitelistData;
    let notInWhitelistData;
    const messageDispatcher = {
      inWhitelist(r) {
        inWhitelistData = r;
      },
      notInWhiteList(r) {
        notInWhitelistData = r;
      },
    };
    registerMain(messageDispatcher, {
      iframeDom: iframe,
      originWhiteList: [origin],
    });

    return new Promise<void>((resolve) => {
      const inWhitelistMsg: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        callName: "inWhitelist",
        messageId: "2",
        data: PING,
      };
      const notInWhiteListMsg: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        callName: "notInWhiteList",
        messageId: "3",
        data: PING,
      };
      // iframe.contentWindow!.parent.postMessage(msg, "*"); // JSDOM postMessage do not set event.origin
      postMessageMock(inWhitelistMsg, origin);
      postMessageMock(notInWhiteListMsg, "https://www.iframe_1.com");

      setTimeout(() => {
        expect(inWhitelistData).toEqual(PING);
        expect(notInWhitelistData).toEqual(void 0);
        resolve();
      }, 1000);
    });
  });
});
