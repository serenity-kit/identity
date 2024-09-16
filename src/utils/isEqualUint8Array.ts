export const isEqualUint8Array = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((value, index) => value === b[index]);
};
