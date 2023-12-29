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
  transfer,
  callName,
  postToOrigin,
}: {
  messageType: MESSAGE_TYPE;
  messageId: string;
  data?: T;
  transfer?: Transferable[];
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
  win.parent.postMessage(messages, postToOrigin || "*", transfer);
}

export async function postRequestToParent<T>({
  callName,
  data,
  transfer,
  awaitResponse = true,
  postToOrigin,
}: {
  callName: string;
  data?: T;
  transfer?: Transferable[];
  awaitResponse?: boolean;
  postToOrigin?: string;
}) {
  const messageId = useId();

  postMessageToParent({
    messageType: MESSAGE_TYPE.REQUEST,
    messageId,
    data,
    transfer,
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
  transfer,
  postToOrigin,
}: {
  messageId: string;
  data: T;
  transfer?: Transferable[];
  postToOrigin?: string;
}) {
  postMessageToParent({
    messageType: MESSAGE_TYPE.RESPONSE,
    messageId,
    data,
    transfer,
    postToOrigin,
  });
}
