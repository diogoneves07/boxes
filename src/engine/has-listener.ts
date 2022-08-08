import { LISTENERS_STORE } from "./listeners-store";
export default function hasListener(eventName: string) {
  if (LISTENERS_STORE.size === 0) {
    return false;
  }

  return (
    LISTENERS_STORE.has(eventName) ||
    LISTENERS_STORE.has(`${eventName}[tree]`) ||
    LISTENERS_STORE.has(`${eventName}[all]`) ||
    LISTENERS_STORE.has(`${eventName}[items]`)
  );
}
