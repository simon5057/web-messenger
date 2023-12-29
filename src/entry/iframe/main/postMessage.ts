import { saveMessageUnresolvedPool } from "../../../message/messagePools";
import { MESSAGE_DATA, MESSAGE_TYPE, SCENE_TYPE } from "../../../message/types";
import { useId } from "../../../tools/id";

let iframe: HTMLIFrameElement | null = null;
export function setIframe(iframeElement: HTMLIFrameElement) {
  iframe = iframeElement;
}
export function hasIframe() {
  return !!iframe;
}
export function clearIframe() {
  iframe = null;
}

function postMessageToIframe<T>({
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
}) {
  if (!iframe) {
    throw new Error("iframe is not set");
  }
  const message: MESSAGE_DATA = {
    messageType,
    callName,
    messageId,
    data,
  };
  iframe.contentWindow?.postMessage(message, postToOrigin || "*", transfer);
}

export async function postRequestToIframe<T>({
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

  postMessageToIframe({
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

export function postResponseToIframe<T>({
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
  postMessageToIframe({
    messageType: MESSAGE_TYPE.RESPONSE,
    messageId,
    data,
    transfer,
    postToOrigin,
  });
}
