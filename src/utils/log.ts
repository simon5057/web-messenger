export function getLogName(key: string) {
  return `[__${key}__]`;
}

const KEY = "WEB_MESSENGER";
export function commonLogName() {
  return getLogName(KEY);
}

export function genCommonLogMessage(message: string) {
  return `${commonLogName()} ${message}`;
}

export function errorMessage(message: string) {
  return new Error(genCommonLogMessage(message));
}
