import { resolveResponseMessage } from "../../../message/messagePools";
import { MESSAGE_DATA, SCENE_TYPE } from "../../../message/types";
import { postRequestToMain, postResponseToMain } from "./postMessage";
import { commonMessageHandler } from "../../../message/onMessage";

let _self: WorkerGlobalScope = self as WorkerGlobalScope;
export function _setWorkerSelfMockForTest(mockSelf: WorkerGlobalScope) {
  _self = mockSelf;
}

export function registerWorker<T extends Object>(messageDispatcher: T) {
  async function messageHandler(event: MessageEvent<MESSAGE_DATA>) {
    commonMessageHandler({
      messageDispatcher,
      event,
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
  }

  _self.addEventListener("message", messageHandler, false);
  const cleanup = () => {
    _self.removeEventListener("message", messageHandler, false);
  };

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
