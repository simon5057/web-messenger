# web-messenger

Let postMessage on Iframe and Worker more convenient.

## Examples

- TODO

## Installation

```
  npm install web-messenger
```

or

```
  yarn add web-messenger
```

or

```
  pnpm add web-messenger
```

## Usage

### Used for iframe

- Main Window

```ts
// main window
import { registerMain } from "web-messenger/iframeMain";

const messageDispatcher = {
  onReady(data) {
    console.log(
      `[messageDispatcher] post from iframe, method "onReady": `,
      data
    );
  },
  parentMethod(params) {
    console.log(
      `[messageDispatcher] post from iframe, method "parentMethod": `,
      params
    );
    return "result";
  },
};

const iframe: HTMLIFrameElement = document.querySelector("#iframeId");
const options: {
  originWhiteList?: string[];
  postToOrigin?: string;
  iframeDom?: HTMLIFrameElement;
} = {
  iframeDOM: iframe,
};

const webMessenger = registerMain(messageDispatcher, options);
```

Post Message to Iframe

```ts
webMessenger.postToIframe(callName, data);
```

```ts
webMessenger.postToIframeAwaitResponse(callName, data);
```

type registerMain

```ts
export declare function registerMain<T extends Object>(
  messageDispatcher: T,
  options?: {
    originWhiteList?: string[];
    postToOrigin?: string;
    iframeDom?: HTMLIFrameElement;
  }
): {
  postToIframe<T_1>(callName: string, data: T_1): Promise<unknown>;
  postToIframeAwaitResponse<T_2>(callName: string, data: T_2): Promise<unknown>;
  cleanup(): void;
};
```

- Iframe window

```ts
// iframe window
import { registerIframe } from "web-messenger/iframeContentWindow";

const messageDispatcher = {
  ping(data) {
    console.log("[messageDispatcher] post from parent, method ping: ", data);
    return "pong";
  },
};

const options: {
  originWhiteList?: string[];
  postToOrigin?: string;
} = {};

const webMessenger = registerIframe(messageDispatcher, options);
```

Post Message to Parent

```ts
webMessenger.postToParent(callName, data);
```

```ts
webMessenger.postToParentAwaitResponse(callName, data);
```

type registerIframe

```ts
export declare function registerIframe<T extends Object>(
  messageDispatcher: T,
  options?: {
    originWhiteList?: string[];
    postToOrigin?: string;
  }
): {
  postToParent<T_1>(callName: string, data: T_1): Promise<unknown>;
  postToParentAwaitResponse<T_2>(callName: string, data: T_2): Promise<unknown>;
  cleanup: () => void;
};
```

### Used for Worker

- TODO
