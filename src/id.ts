import { randomBytes } from "crypto";

const UNMISTAKABLE_CHARS = "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz";

/**
 *  This function generates ids that are essentially identical to Meteor Random.id()
 *  generated ids.
 */
export function id(length?: number): string {
  if (!length) {
    length = 17;
  }
  const rnd = randomBytes(length);
  const result = new Array(length);
  let cursor = 0;
  for (let i = 0; i < length; i++) {
    cursor += rnd[i];
    result[i] = UNMISTAKABLE_CHARS[cursor % UNMISTAKABLE_CHARS.length];
  }
  return result.join("");
}
