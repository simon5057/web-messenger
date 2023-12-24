import("https://cdn.jsdelivr.net/npm/web-messenger/dist/webMessenger-workerScope.umd.js").then(() => {
  const webMessenger = WebMessengerWorkerScope.registerWorker({
    ping(data) {
      console.log(
        "[worker][messageDispatcher] post from main, method ping: ",
        data
      );
      return "pong";
    },
    workerToMain() {
      webMessenger
        .postToMainAwaitResponse("mainMethod", "parameters")
        .then((data) => {
          console.log(
            `[worker][response] post to main, method "mainMethod": `,
            data
          );
        });
    },
  });
  webMessenger.postToMain("onReady", "onReady");
});
