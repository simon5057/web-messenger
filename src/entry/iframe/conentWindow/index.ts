import { resolveResponseMessage } from "@/message/messagePools";
import { SCENE_TYPE } from "@/message/types";
import { postRequestToParent, postResponseToParent } from "./postMessage";
import iframeOnMessage from "../common/onMessage";

export default function registerIframe<T extends Object>(
  messageDispatcher: T,
  options?: {
    originWhiteList?: string[];
    postToOrigin?: string;
  }
) {
  const cleanup = iframeOnMessage({
    messageDispatcher,
    postResponse: (messageId: string, data: any) => {
      postResponseToParent({
        messageId,
        data,
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
    cleanup,
  };
}

export const postMessageToParent = postRequestToParent;
