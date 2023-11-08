import { describe, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PING } from "../../../../utils/forTest";
import { postMessageMock } from "../../../../mock/postMessage.mock";

describe("Main postMessage Restrictions 1", () => {
  it("Origin: White List", () => {
    let iframe = window.document.createElement("iframe");
    iframe.src = "https://www.iframe.com";
    window.document.body.appendChild(iframe);

    let data;
    let data1;
    const messageDispatcher = {
      ping(r) {
        data = r;
      },
      whitelist(r) {
        data1 = r;
      },
    };
    registerMain(messageDispatcher, {
      iframeDom: iframe,
      originWhiteList: ["https://www.iframe.com"],
    });

    return new Promise<void>((resolve) => {
      const msg: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        callName: "ping",
        messageId: "2",
        data: PING,
      };
      const msg1: MESSAGE_DATA = {
        messageType: MESSAGE_TYPE.REQUEST,
        callName: "whitelist",
        messageId: "3",
        data: PING,
      };
      // iframe.contentWindow!.parent.postMessage(msg, "*"); // JSDOM postMessage do not set event.origin
      postMessageMock(msg, "https://www.iframe.com");
      postMessageMock(msg1, "https://www.iframe_1.com");

      setTimeout(() => {
        expect(data).toEqual(PING);
        expect(data1).toEqual(void 0);
        resolve();
      }, 1000);
    });
  });
});
