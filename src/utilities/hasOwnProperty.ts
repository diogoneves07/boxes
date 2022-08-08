export default function hasOwnProperty(
  o: object,
  key: string | number | symbol
) {
  if (!o) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(o, key);
}
