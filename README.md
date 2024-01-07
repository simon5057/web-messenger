# web-messenger

Let postMessage on Iframe and Worker more convenient.

## Examples

- Iframe [iframe example](./examples/iframe/example.html)
- Worker [Worker example](./examples/worker/example.html)

- Iframe data transferable [iframe data transferable example](./examples/iframe-transfer/example.html)
- Worker data transferable [Worker data transferable example](./examples/worker-transfer/example.html)

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

#### ESModule

- Main Window

```ts
// main window
import { WebMessengerIframeMain } from "web-messenger";

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

const webMessenger = WebMessengerIframeMain.registerMain(
  messageDispatcher,
  options
);
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
import { WebMessengerIframeContentWindow } from "web-messenger";

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

const webMessenger = WebMessengerIframeContentWindow.registerIframe(
  messageDispatcher,
  options
);
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

#### Browser

- Main Window

```html
<script src="https://cdn.jsdelivr.net/npm/web-messenger/dist/webMessenger-iframeMain.umd.min.js"></script>
<script>
  const webMessenger = WebMessengerIframeMain.registerMain(
    messageDispatcher,
    options
  );
</script>
```

- Iframe window

```html
<script src="https://cdn.jsdelivr.net/npm/web-messenger/dist/webMessenger-iframeContentWindow.umd.js"></script>
<script>
  const webMessenger = WebMessengerIframeContentWindow.registerIframe(
    messageDispatcher,
    options
  );
</script>
```

### Used for Worker

#### ESModule

- Main Window

```ts
// main window
import { WebMessengerWorkerMain } from "web-messenger";

const messageDispatcher = {
  onReady(data) {
    console.log(
      `[messageDispatcher] post from worker, method "onReady": `,
      data
    );
  },
  mainMethod(params) {
    console.log(
      `[messageDispatcher] post from worker, method "mainMethod": `,
      params
    );
    return "result";
  },
};

const worker = new Worker("**/**.js");
const options: {
  worker: Worker;
} = {
  worker,
};

const webMessenger = WebMessengerWorkerMain.registerMain(
  messageDispatcher,
  options
);
```

Post Message to Worker

```ts
webMessenger.postToWorker(callName, data);
```

```ts
webMessenger.postToWorkerAwaitResponse(callName, data);
```

type registerMain

```ts
export declare function registerMain<T extends Object>(
  messageDispatcher: T,
  options: {
    worker: Worker;
  }
): {
  postToWorker<T_1>(callName: string, data: T_1): Promise<unknown>;
  postToWorkerAwaitResponse<T_2>(callName: string, data: T_2): Promise<unknown>;
  cleanup(): void;
};
```

- Worker scope

```ts
// worker scope
import { WebMessengerWorkerScope } from "web-messenger";

const messageDispatcher = {
  ping(data) {
    console.log("[messageDispatcher] post from main, method ping: ", data);
    return "pong";
  },
};

const webMessenger = WebMessengerWorkerScope.registerWorker(messageDispatcher);
```

Post Message to Main

```ts
webMessenger.postToMain(callName, data);
```

```ts
webMessenger.postToMainAwaitResponse(callName, data);
```

type registerWorker

```ts
export declare function registerWorker<T extends Object>(
  messageDispatcher: T
): {
  postToMain<T_1>(callName: string, data: T_1): Promise<unknown>;
  postToMainAwaitResponse<T_2>(callName: string, data: T_2): Promise<unknown>;
  cleanup: () => void;
};
```

#### Browser

- Main Window

```html
<script src="https://cdn.jsdelivr.net/npm/web-messenger/dist/webMessenger-workerMain.umd.min.js"></script>
<script>
  const webMessenger = WebMessengerWorkerMain.registerMain(
    messageDispatcher,
    options
  );
</script>
```

- Worker Scope

```html
<script src="https://cdn.jsdelivr.net/npm/web-messenger/dist/webMessenger-workerScope.umd.js"></script>
<script>
  const webMessenger =
    WebMessengerWorkerScope.registerWorker(messageDispatcher);
</script>
```

### Data transferable

> As we know, postMessage can transfer Transferable objects between threads.
> [Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects)
> To make data transferable, we had provided features for two scenarios.

#### MessageDisPatcher

> After receiving a call from another side, we sometimes want the data in that response to be transferable.
>
> 1. Define a function in MessageDispatcher with a name ends with `Transferable`, Such as `MyFeatureTransferable`
> 2. This function must return a tuple of to elements(`[data, Transferable[]]`), the first one is the data which actually return to the another side, the second is for data transfer(which data can be transferable).

```ts
const messageDispatcher = {
  MyFeatureTransferable(params) {
    const transferableObjects = new ArrayBuffer(10);
    return [transferableObjects, [transferableObjects]];
  },
};
```

#### Post to another side

> To send transferable data to another side, we provide "postTo\*Transferable" to do so.
> Such as with Iframe `postToIframeTransferable`, `postToIframeTransferableAwaitResponse`, `postToParentTransferable`, `postToParentTransferableAwaitResponse`

Post Message to Iframe data transfer

```ts
const webMessenger = WebMessengerIframeMain.registerMain(
  messageDispatcher,
  options
);
webMessenger.postToIframeTransferable(callName, data);
webMessenger.postToIframeTransferableAwaitResponse(callName, data);
```

Post Message to Parent data transfer

```ts
const webMessenger = WebMessengerIframeContentWindow.registerIframe(
  messageDispatcher,
  options
);
webMessenger.postToParentTransferable(callName, data);
webMessenger.postToParentTransferableAwaitResponse(callName, data);
```

Post Message to Worker data transfer

```ts
const webMessenger = WebMessengerWorkerMain.registerMain(
  messageDispatcher,
  options
);
webMessenger.postToWorkerTransferable(callName, data);
webMessenger.postToWorkerTransferableAwaitResponse(callName, data);
```

Post Message to Main data transfer

```ts
const webMessenger = WebMessengerWorkerScope.registerWorker(messageDispatcher);
webMessenger.postToMainTransferable(callName, data);
webMessenger.postToMainTransferableAwaitResponse(callName, data);
```
