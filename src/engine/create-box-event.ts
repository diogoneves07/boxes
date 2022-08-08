import { NormalBox } from "./../types/normal-box";

export default function CreateBoxEvent(
  box: NormalBox,
  eventName: string,
  data: any | null = null,
  off?: () => void
) {
  let eventNameWithoutFlag = eventName;
  const flagInitIndex = eventNameWithoutFlag.indexOf("[");
  let flag = "[normal]";
  if (flagInitIndex > -1) {
    const splitFlag = eventNameWithoutFlag.split("[");
    eventNameWithoutFlag = splitFlag[0];
    flag = "[" + splitFlag[1];
  }
  return {
    box,
    eventName: eventNameWithoutFlag,
    off,
    flag,
    target: box,
    data,
  };
}
