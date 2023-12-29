import { resolveResponseMessage } from "../../../message/messagePools";
import { MESSAGE_DATA, SCENE_TYPE } from "../../../message/types";
import {
  clearWorker,
  postRequestToWorker,
  postResponseToWorker,
  setWorker,
} from "./postMessage";
import { errorMessage } from "../../../utils/log";
import { commonMessageHandler } from "../../../message/onMessage";

export function registerMain<T extends Object>(
  messageDispatcher: T,
  options: {
    worker: Worker;
  }
) {
  if (!options?.worker) {
    throw errorMessage("options.worker is required");
  }
  setWorker(options.worker);

  async function messageHandler(event: MessageEvent<MESSAGE_DATA>) {
    commonMessageHandler({
      messageDispatcher,
      event,
      postResponse: (
        messageId: string,
        data: any,
        transfer: Transferable[]
      ) => {
        postResponseToWorker({
          messageId,
          data,
          transfer,
        });
      },
      receiveResponse: (messageId: string, data: any) => {
        resolveResponseMessage(SCENE_TYPE.WORKER, { messageId, data });
      },
    });
  }

  options.worker.addEventListener("message", messageHandler);
  const cleanup = () => {
    options.worker.removeEventListener("message", messageHandler);
  };

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
    postToWorkerTransferable<T>(
      callName: string,
      data: T,
      transfer: Transferable[]
    ) {
      return postRequestToWorker({
        callName,
        data,
        transfer,
        awaitResponse: false,
      });
    },
    postToWorkerTransferableAwaitResponse<T>(
      callName: string,
      data: T,
      transfer: Transferable[]
    ) {
      return postRequestToWorker({
        callName,
        data,
        transfer,
      });
    },
    cleanup() {
      cleanup();
      clearWorker();
    },
  };
}

export const postMessageToWorker = postRequestToWorker;
