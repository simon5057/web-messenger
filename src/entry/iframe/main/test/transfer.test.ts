import { describe, beforeEach, expect, it } from "@jest/globals";
import { registerMain } from "..";
import { MESSAGE_DATA, MESSAGE_TYPE } from "../../../../message/types";
import { PONG } from "../../../../utils/forTest";

describe("Main postMessage with transferable data", () => {
  let iframe: HTMLIFrameElement;
  let messageBridge: ReturnType<typeof registerMain>;

  beforeEach(() => {
    iframe = window.document.createElement("iframe");
    window.document.body.appendChild(iframe);
    messageBridge = registerMain(
      {
        pingTransferable(from) {
          return [from, [from]];
        },
      },
      {
        iframeDom: iframe,
      }
    );
  });

  it("MessageDispatcher Transferable: receive and response", () => {
    const data = new ArrayBuffer(1);
    data[0] = 0;
    const msg: MESSAGE_DATA = {
      messageType: MESSAGE_TYPE.REQUEST,
      callName: "pingTransferable",
      messageId: "1",
      data,
    };
    iframe.contentWindow!.parent.postMessage(msg, "*");

    return new Promise<void>((resolve) => {
      iframe.contentWindow!.addEventListener("message", (e) => {
        expect(e.data.data).toEqual(data);
        resolve();
      });
    });
  });

  it("Post To Iframe transferable", () => {
    const callName = "postIframeTransferable";
    return new Promise<void>((resolve) => {
      const data = new ArrayBuffer(1);
      data[0] = 0;
      iframe.contentWindow!.addEventListener("message", (e) => {
        expect(e.data.data).toEqual(data);
        expect(e.data.callName).toEqual(callName);
        resolve();
      });

      messageBridge.postToIframeTransferable(callName, data, [data]);
    });
  });

  it("Post To Iframe transferable: Await Response", () => {
    const callName = "postIframe";
    return new Promise<void>((resolve) => {
      const data = new ArrayBuffer(1);
      data[0] = 0;

      let receiveData;
      iframe.contentWindow!.addEventListener("message", (e) => {
        receiveData = e.data.data;
        const msg: MESSAGE_DATA = {
          messageType: MESSAGE_TYPE.RESPONSE,
          messageId: e.data.messageId,
          data: PONG,
        };
        iframe.contentWindow!.parent.postMessage(msg, "*");
      });
      messageBridge
        .postToIframeTransferableAwaitResponse(callName, data, [data])
        .then((r) => {
          expect(data).toEqual(receiveData)
          expect(r).toEqual(PONG);
          resolve();
        });
    });
  });
});
