import { JEST_MOCK_ID } from "../utils/forTest";

export function useId() {
  if (process.env.NODE_ENV === "test") {
    return JEST_MOCK_ID;
  }
  const id = `${Date.now().toString()}_${Math.random().toFixed(4)}`;
  return id;
}
