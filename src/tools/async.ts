export function sleep(wait: number = 2000) {
  return new Promise<null>((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, wait);
  });
}

export function race<T>(pending: Promise<T>, timeout = 10000) {
  return Promise.race([
    sleep(timeout).then(() => Promise.reject(`Timeout: ${timeout}ms`)),
    pending,
  ]);
}
