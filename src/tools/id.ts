export function useId() {
  const id = `${Date.now().toString()}_${Math.random().toFixed(4)}`;
  return id;
}
