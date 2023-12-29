import { resolveResponseMessage } from "../../../message/messagePools";
import { SCENE_TYPE } from "../../../message/types";
import { postRequestToParent, postResponseToParent } from "./postMessage";
import iframeOnMessage from "../common/onMessage";

export function registerIframe<T extends Object>(
  messageDispatcher: T,
  options?: {
    originWhiteList?: string[];
    postToOrigin?: string;
  }
) {
  const cleanup = iframeOnMessage({
    messageDispatcher,
    postResponse: (messageId: string, data: any, transfer?: Transferable[]) => {
      postResponseToParent({
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
    postToParent<T>(callName: string, data: T) {
      return postRequestToParent({
        callName,
        data,
        postToOrigin: options?.postToOrigin,
        awaitResponse: false,
      });
    },
    postToParentAwaitResponse<T>(callName: string, data: T) {
      return postRequestToParent({
        callName,
        data,
        postToOrigin: options?.postToOrigin,
      });
    },
    postToParentTransferable<T>(
      callName: string,
      data: T,
      transfer: Transferable[]
    ) {
      return postRequestToParent({
        callName,
        data,
        transfer,
        postToOrigin: options?.postToOrigin,
        awaitResponse: false,
      });
    },
    postToParentTransferableAwaitResponse<T>(
      callName: string,
      data: T,
      transfer: Transferable[]
    ) {
      return postRequestToParent({
        callName,
        data,
        transfer,
        postToOrigin: options?.postToOrigin,
      });
    },
    cleanup,
  };
}

export const postMessageToParent = postRequestToParent;
