import { resolveResponseMessage } from "../../../message/messagePools";
import { SCENE_TYPE } from "../../../message/types";
import {
  clearIframe,
  postRequestToIframe,
  postResponseToIframe,
  setIframe,
} from "./postMessage";
import iframeOnMessage from "../common/onMessage";

export function registerMain<T extends Object>(
  messageDispatcher: T,
  options?: {
    originWhiteList?: string[];
    postToOrigin?: string;
    iframeDom?: HTMLIFrameElement;
  }
) {
  if (options?.iframeDom) {
    setIframe(options.iframeDom);
  }
  const cleanup = iframeOnMessage({
    messageDispatcher,
    postResponse: (messageId: string, data: any, transfer: Transferable[]) => {
      postResponseToIframe({
        messageId,
        data,
        transfer,
        postToOrigin: options?.postToOrigin,
      });
    },
    receiveResponse: (messageId: string, data: any) => {
      resolveResponseMessage(SCENE_TYPE.IFRAME, { messageId, data });
    },
    originWhiteList: options?.originWhiteList,
  });

  return {
    postToIframe<T>(callName: string, data: T) {
      return postRequestToIframe({
        callName,
        data,
        postToOrigin: options?.postToOrigin,
        awaitResponse: false,
      });
    },
    postToIframeAwaitResponse<T>(callName: string, data: T) {
      return postRequestToIframe({
        callName,
        data,
        postToOrigin: options?.postToOrigin,
      });
    },
    postToIframeTransferable<T>(
      callName: string,
      data: T,
      transfer: Transferable[]
    ) {
      return postRequestToIframe({
        callName,
        data,
        transfer,
        postToOrigin: options?.postToOrigin,
        awaitResponse: false,
      });
    },
    postToIframeTransferableAwaitResponse<T>(
      callName: string,
      data: T,
      transfer: Transferable[]
    ) {
      return postRequestToIframe({
        callName,
        data,
        transfer,
        postToOrigin: options?.postToOrigin,
      });
    },
    cleanup() {
      cleanup();
      clearIframe();
    },
  };
}

export const postMessageToIframe = postRequestToIframe;
