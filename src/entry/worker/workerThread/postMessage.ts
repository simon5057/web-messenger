import { errorMessage } from "../../../utils/log";
import { MESSAGE_DATA, MESSAGE_TYPE, SCENE_TYPE } from "../../../message/types";
import { useId } from "../../../tools/id";
import { saveMessageUnresolvedPool } from "../../../message/messagePools";

let _postMessage: typeof postMessage = postMessage;
export function _setWorkerPostMessageMockForTest(
  postMessageFn: typeof postMessage
) {
  _postMessage = postMessageFn;
}

function postMessageToMain<T>({
  messageType,
  messageId,
  data,
  callName,
}: {
  messageType: MESSAGE_TYPE;
  messageId: string;
  data?: T;
  callName?: string;
}): void {
  if (
    typeof WorkerGlobalScope === "undefined" ||
    !(self instanceof WorkerGlobalScope)
  ) {
    console.warn(errorMessage("not in worker"));
  }
  const messages: MESSAGE_DATA = {
    messageType,
    callName,
    messageId,
    data,
  };
  _postMessage(messages);
}

export async function postRequestToMain<T>({
  callName,
  data,
  awaitResponse = true,
}: {
  callName: string;
  data?: T;
  awaitResponse?: boolean;
}) {
  const messageId = useId();

  postMessageToMain({
    messageType: MESSAGE_TYPE.REQUEST,
    messageId,
    data,
    callName,
  });
  if (!awaitResponse) return;
  return new Promise((resolve) => {
    saveMessageUnresolvedPool(SCENE_TYPE.WORKER, messageId, resolve);
  });
}

export function postResponseToMain<T>({
  messageId,
  data,
}: {
  messageId: string;
  data: T;
}) {
  postMessageToMain({
    messageType: MESSAGE_TYPE.RESPONSE,
    messageId,
    data,
  });
}
