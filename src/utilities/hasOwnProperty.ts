export default function hasOwnProperty(o: object, key: string) {
  if (!o) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(o, key);
}
