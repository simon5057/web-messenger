import { getLogName } from "@/utils/log";
import { sleep } from "./async";

async function timeAsyncAction<T>(pending: Promise<T>) {
  const start = Date.now();
  const res = await pending;
  const end = Date.now();
  return {
    res,
    pendingTime: end - start,
  };
}

async function timeCounting(options: {
  hasFullFilled: () => boolean;
  acceleration?: number;
  interval?: number;
}) {
  const { hasFullFilled, acceleration = 0, interval = 3000 } = options || {};

  if (!hasFullFilled()) {
    await sleep(interval);

    if (hasFullFilled()) {
      return;
    }

    const accumulateTime = interval + acceleration;
    console.warn(getLogName("Time_Counting"), accumulateTime);
    if (accumulateTime > 300 * 1000) return;
    timeCounting({ hasFullFilled, acceleration: accumulateTime });
  }
}

export async function asyncActionTimeCounting<T>(
  pending: Promise<T>,
  extraInfo?: {
    key?: string;
    info?: any;
    maxPendingTime?: number;
  }
) {
  let fullFilled = false;
  timeCounting({ hasFullFilled: () => fullFilled });

  const { res, pendingTime } = await timeAsyncAction(pending);
  fullFilled = true;
  const { maxPendingTime = 3000, key, info } = extraInfo || {};

  if (pendingTime > maxPendingTime) {
    let logKey = key ? getLogName(key) : "";
    logKey = `${logKey}${getLogName("Pending_Time")}: ${pendingTime}ms`;
    console.warn(logKey, info);
  }

  return res;
}
