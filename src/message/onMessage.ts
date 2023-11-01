import { errorMessage } from "../utils/log";
import { MESSAGE_DATA, MESSAGE_TYPE } from "./types";

export async function commonMessageHandler<T extends Object>({
  messageDispatcher,
  event,
  postResponse,
  receiveResponse,
}: {
  messageDispatcher: T;
  event: MessageEvent<MESSAGE_DATA>;
  postResponse: (messageId: string, data: any) => void;
  receiveResponse: (messageId: string, data: any) => void;
}) {
  const { messageType, messageId, callName, data } = event.data;
  switch (messageType) {
    case MESSAGE_TYPE.REQUEST:
      if (!callName) {
        throw errorMessage("callName is required");
      }
      if (!messageDispatcher) {
        throw errorMessage("messageDispatcher not found");
      }
      if (
        !messageDispatcher[callName] ||
        typeof messageDispatcher[callName] !== "function"
      ) {
        throw errorMessage(`messageDispatcher.${callName} neither found or callable`);
      }
      const res = await (messageDispatcher[callName] as CallableFunction)(data);
      postResponse(messageId, res);
      break;

    case MESSAGE_TYPE.RESPONSE:
      receiveResponse(messageId, data);
      break;

    default:
      break;
  }
}
