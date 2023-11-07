import { errorMessage } from "../../../utils/log";
import { MESSAGE_DATA, MESSAGE_TYPE, SCENE_TYPE } from "../../../message/types";
import { useId } from "../../../tools/id";
import { saveMessageUnresolvedPool } from "../../../message/messagePools";

let win: Window = window;
export function _setWinForTest(mockWin: Window) {
  win = mockWin;
}

function postMessageToParent<T>({
  messageType,
  messageId,
  data,
  callName,
  postToOrigin,
}: {
  messageType: MESSAGE_TYPE;
  messageId: string;
  data?: T;
  callName?: string;
  postToOrigin?: string;
}): void {
  if (win.parent === win) {
    throw errorMessage("not in iframe");
  }
  const messages: MESSAGE_DATA = {
    messageType,
    callName,
    messageId,
    data,
  };
  win.parent.postMessage(messages, postToOrigin || "*");
}

export async function postRequestToParent<T>({
  callName,
  data,
  awaitResponse = true,
  postToOrigin,
}: {
  callName: string;
  data?: T;
  awaitResponse?: boolean;
  postToOrigin?: string;
}) {
  const messageId = useId();

  postMessageToParent({
    messageType: MESSAGE_TYPE.REQUEST,
    messageId,
    data,
    callName,
    postToOrigin,
  });
  if (!awaitResponse) return;
  return new Promise((resolve) => {
    saveMessageUnresolvedPool(SCENE_TYPE.IFRAME, messageId, resolve);
  });
}

export function postResponseToParent<T>({
  messageId,
  data,
  postToOrigin,
}: {
  messageId: string;
  data: T;
  postToOrigin?: string;
}) {
  postMessageToParent({
    messageType: MESSAGE_TYPE.RESPONSE,
    messageId,
    data,
    postToOrigin,
  });
}
