import { describe, expect, it, jest } from "@jest/globals";
import { MESSAGE_TYPE } from "../types";
import { PING } from "../../utils/forTest";
import { commonMessageHandler } from "../onMessage";

describe("onMessage error", () => {
  it("no callName", async () => {
    try {
      const event: any = {
        data: {
          messageType: MESSAGE_TYPE.REQUEST,
          callName: "",
          messageId: "1",
          data: PING,
        },
      };
      await commonMessageHandler({
        messageDispatcher: {},
        event,
        postResponse: jest.fn(),
        receiveResponse: jest.fn(),
      });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("no messageDispatcher", async () => {
    try {
      const event: any = {
        data: {
          messageType: MESSAGE_TYPE.REQUEST,
          callName: "callName",
          messageId: "1",
          data: PING,
        },
      };
      await commonMessageHandler({
        messageDispatcher: null,
        event,
        postResponse: jest.fn(),
        receiveResponse: jest.fn(),
      } as any);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("no specific callName in messageDispatcher", async () => {
    try {
      const event: any = {
        data: {
          messageType: MESSAGE_TYPE.REQUEST,
          callName: "callName",
          messageId: "1",
          data: PING,
        },
      };
      await commonMessageHandler({
        messageDispatcher: {},
        event,
        postResponse: jest.fn(),
        receiveResponse: jest.fn(),
      } as any);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it("not support messageType or not provide", async () => {
    try {
      const event: any = {
        data: {
          callName: "callName",
          messageId: "1",
          data: PING,
        },
      };
      await commonMessageHandler({
        messageDispatcher: {},
        event,
        postResponse: jest.fn(),
        receiveResponse: jest.fn(),
      } as any);
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
