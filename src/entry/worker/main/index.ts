import { resolveResponseMessage } from "../../../message/messagePools";
import { SCENE_TYPE } from "../../../message/types";
import {
  clearWorker,
  postRequestToWorker,
  postResponseToWorker,
  setWorker,
} from "./postMessage";
import workerOnMessage from "../common/onMessage";

export function registerMain<T extends Object>(
  messageDispatcher: T,
  options?: {
    worker?: Worker;
  }
) {
  if (options?.worker) {
    setWorker(options.worker);
  }
  const cleanup = workerOnMessage({
    messageDispatcher,
    postResponse: (messageId: string, data: any) => {
      postResponseToWorker({
        messageId,
        data,
      });
    },
    receiveResponse: (messageId: string, data: any) => {
      resolveResponseMessage(SCENE_TYPE.WORKER, { messageId, data });
    },
  });

  return {
    postToWorker<T>(callName: string, data: T) {
      return postRequestToWorker({
        callName,
        data,
        awaitResponse: false,
      });
    },
    postToWorkerAwaitResponse<T>(callName: string, data: T) {
      return postRequestToWorker({
        callName,
        data,
      });
    },
    cleanup() {
      cleanup();
      clearWorker();
    },
  };
}

export const postMessageToWorker = postRequestToWorker;
