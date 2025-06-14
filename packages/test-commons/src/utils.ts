export function hexToBytes(hex: string): Uint8Array {
  return Buffer.from(hex, 'hex');
}

export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}
