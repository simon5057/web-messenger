import { commonMessageHandler } from "../../../message/onMessage";
import { MESSAGE_DATA } from "../../../message/types";

export default function workerOnMessage<T extends Object>(options: {
  messageDispatcher: T;
  postResponse: (messageId: string, data: any) => void;
  receiveResponse: (messageId: string, data: any) => void;
}) {
  const { messageDispatcher, postResponse, receiveResponse } = options;

  async function messageHandler(event: MessageEvent<MESSAGE_DATA>) {
    commonMessageHandler({
      messageDispatcher,
      event,
      postResponse,
      receiveResponse,
    });
  }

  window.addEventListener("message", messageHandler, false);
  return () => {
    window.removeEventListener("message", messageHandler, false);
  };
}
