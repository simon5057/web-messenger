import { MESSAGE_DATA, SCENE_TYPE } from "./types";

const iframeMessageUnresolvedPool: Record<string, any> = {};
const workerMessageUnresolvedPool: Record<string, any> = {};

function getPool(type: SCENE_TYPE) {
  switch (type) {
    case SCENE_TYPE.IFRAME:
      return iframeMessageUnresolvedPool;
    case SCENE_TYPE.WORKER:
      return workerMessageUnresolvedPool;
    default:
      throw new Error("type is not supported");
  }
}

export function saveMessageUnresolvedPool(
  type: SCENE_TYPE,
  messageId: string,
  resolve: (value: any) => void
) {
  const pool = getPool(type);
  pool[messageId] = resolve;
}

export function resolveResponseMessage(
  type: SCENE_TYPE,
  messageData: Pick<MESSAGE_DATA, "messageId" | "data">
) {
  const { messageId, data } = messageData;
  const pool = getPool(type);
  const resolve = pool[messageId];
  if (resolve) {
    resolve(data);
    pool[messageId] = null;
  }
}
