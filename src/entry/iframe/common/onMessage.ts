import { commonMessageHandler } from "../../../message/onMessage";
import { MESSAGE_DATA } from "../../../message/types";

export default function iframeOnMessage<T extends Object>(options: {
  messageDispatcher: T;
  postResponse: (messageId: string, data: any) => void;
  receiveResponse: (messageId: string, data: any) => void;
  originWhiteList?: string[];
}) {
  const { messageDispatcher, postResponse, receiveResponse, originWhiteList } =
    options;

  async function messageHandler(event: MessageEvent<MESSAGE_DATA>) {
    if (originWhiteList && !originWhiteList.includes(event.origin)) {
      return;
    }

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
