import { saveMessageUnresolvedPool } from "../../../message/messagePools";
import { MESSAGE_DATA, MESSAGE_TYPE, SCENE_TYPE } from "../../../message/types";
import { useId } from "../../../tools/id";

let _worker: Worker | null = null;
export function setWorker(worker: Worker) {
  _worker = worker;
}
export function hasWorker() {
  return !!_worker;
}
export function clearWorker() {
  _worker = null;
}

function postMessageToWorker<T>({
  messageType,
  messageId,
  data,
  callName,
}: {
  messageType: MESSAGE_TYPE;
  messageId: string;
  data?: T;
  callName?: string;
}) {
  if (!_worker) {
    throw new Error("worker is not set");
  }
  const message: MESSAGE_DATA = {
    messageType,
    callName,
    messageId,
    data,
  };
  _worker.postMessage(message);
}

export async function postRequestToWorker<T>({
  callName,
  data,
  awaitResponse = true,
}: {
  callName: string;
  data?: T;
  awaitResponse?: boolean;
}) {
  const messageId = useId();

  postMessageToWorker({
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

export function postResponseToWorker<T>({
  messageId,
  data,
}: {
  messageId: string;
  data: T;
}) {
  postMessageToWorker({
    messageType: MESSAGE_TYPE.RESPONSE,
    messageId,
    data,
  });
}
