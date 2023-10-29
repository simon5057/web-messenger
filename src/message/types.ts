export enum SCENE_TYPE {
  IFRAME = "iframe",
  WORKER = "worker",
}

export enum MESSAGE_TYPE {
  REQUEST = "request",
  RESPONSE = "response",
}

export type MESSAGE_DATA = {
  messageType: MESSAGE_TYPE;
  callName?: string;
  messageId: string;
  data: any;
};
