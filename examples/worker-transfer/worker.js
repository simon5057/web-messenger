import(
  "https://cdn.jsdelivr.net/npm/web-messenger/dist/webMessenger-workerScope.umd.js"
).then(() => {
  const webMessenger = WebMessengerWorkerScope.registerWorker({
    pingTransferable(data) {
      console.log(
        "[worker][messageDispatcher] post from main, method pingTransferable: ",
        data
      );
      const arr = new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1]);
      const buffer = arr.buffer;
      setTimeout(() => {
        console.log(arr);
      }, 1000);
      return [arr, [buffer]];
    },
    workerToMain() {
      const arr = new Uint8Array([18, 17, 16, 15, 14, 13, 12, 11]);
      const buffer = arr.buffer;
      setTimeout(() => {
        console.log(arr);
      }, 1000);
      webMessenger
        .postToMainTransferableAwaitResponse("mainMethodTransferable", arr, [buffer])
        .then((data) => {
          console.log(
            `[worker][response] post to main, method "mainMethodTransferable": `,
            data
          );
        });
    },
  });
  webMessenger.postToMain("onReady", "onReady");
});
