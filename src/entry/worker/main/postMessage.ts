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
  transfer,
  callName,
}: {
  messageType: MESSAGE_TYPE;
  messageId: string;
  data?: T;
  transfer?: Transferable[];
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
  _worker.postMessage(message, { transfer });
}

export async function postRequestToWorker<T>({
  callName,
  data,
  transfer,
  awaitResponse = true,
}: {
  callName: string;
  data?: T;
  transfer?: Transferable[];
  awaitResponse?: boolean;
}) {
  const messageId = useId();

  postMessageToWorker({
    messageType: MESSAGE_TYPE.REQUEST,
    messageId,
    data,
    transfer,
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
  transfer,
}: {
  messageId: string;
  data: T;
  transfer?: Transferable[];
}) {
  postMessageToWorker({
    messageType: MESSAGE_TYPE.RESPONSE,
    messageId,
    data,
    transfer,
  });
}
