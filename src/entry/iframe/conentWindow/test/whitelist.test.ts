import { describe, expect, it } from "@jest/globals";
import { registerIframe } from "..";
import { PING } from "../../../../utils/forTest";
import { _setWinForTest } from "../postMessage";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { postMessageMock } from "../../../../mock/postMessage.mock";
import { createMockWindow } from "./index.mock";

describe("Iframe postMessage Restrictions 1", () => {
  it("Origin: White List", () => {
    const mockWindow: any = createMockWindow();
    _setWinForTest(mockWindow);
    const origin = "https://www.iframe.com";
    let inWhitelistData;
    let notInWhitelistData;
    registerIframe(
      {
        inWhitelist(r) {
          inWhitelistData = r;
        },
        notInWhiteList(r) {
          notInWhitelistData = r;
        },
      },
      {
        originWhiteList: [origin],
      }
    );

    const inWhitelistMsg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "inWhitelist",
      messageId: "3",
      data: PING,
    };
    const notInWhiteListMsg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "notInWhiteList",
      messageId: "2",
      data: PING,
    };
    postMessageMock(inWhitelistMsg, origin);
    postMessageMock(notInWhiteListMsg, "https://www.iframe_1.com");

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(inWhitelistData).toEqual(PING);
        expect(notInWhitelistData).toEqual(void 0);
        resolve();
      }, 1000);
    });
  });
});
