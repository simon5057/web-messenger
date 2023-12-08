import { resolveResponseMessage } from "../../../message/messagePools";
import { SCENE_TYPE } from "../../../message/types";
import { postRequestToMain, postResponseToMain } from "./postMessage";
import workerOnMessage from "../common/onMessage";

export function registerWorker<T extends Object>(messageDispatcher: T) {
  const cleanup = workerOnMessage({
    messageDispatcher,
    postResponse: (messageId: string, data: any) => {
      postResponseToMain({
        messageId,
        data,
      });
    },
    receiveResponse: (messageId: string, data: any) => {
      resolveResponseMessage(SCENE_TYPE.WORKER, { messageId, data });
    },
  });

  return {
    postToMain<T>(callName: string, data: T) {
      return postRequestToMain({
        callName,
        data,
        awaitResponse: false,
      });
    },
    postToMainAwaitResponse<T>(callName: string, data: T) {
      return postRequestToMain({
        callName,
        data,
      });
    },
    cleanup,
  };
}

export const postMessageToMain = postRequestToMain;
