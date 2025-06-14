import { EcPublicKey } from './public-key';
import {
  decodePkixEcdsaSigValue,
  Hash,
  SignatureFormat,
  UnsupportedHashError,
  UnsupportedSignatureFormatError,
} from '@road-labs/ocmf-crypto';
import { getGroupOrderSize } from './curve';

/**
 * @param signature - X.509 ECDSASigValue ASN.1 type DER encoded
 * @param data - Raw value
 * @param key - The public key to verify against
 * @param hash - Hash to apply
 * @param format - Signature format
 */
export default async function verify(
  signature: Uint8Array,
  data: Uint8Array,
  key: EcPublicKey,
  hash: Hash,
  format: SignatureFormat
): Promise<boolean> {
  if (hash !== 'SHA-256') {
    throw new UnsupportedHashError(`Invalid hash: ${hash}`);
  }
  if (format !== 'sigvalue-der') {
    throw new UnsupportedSignatureFormatError(
      `Invalid signature format: ${format}`
    );
  }

  // Convert to IEEE P1363 concatenated R|S format.
  // Ref:
  // - https://crypto.stackexchange.com/a/1797
  // - https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/sun/security/util/ECUtil.java#L290-L299
  // - https://chromium.googlesource.com/chromium/src/+/master/components/webcrypto/algorithms/ecdsa.cc#74
  const sigValue = decodePkixEcdsaSigValue(signature);
  const size = getGroupOrderSize(key.getCurve());
  const r = padZeros(trimSignByte(sigValue.r), size);
  const s = padZeros(trimSignByte(sigValue.s), size);
  const rs = new Uint8Array(size * 2);
  rs.set(r, 0);
  rs.set(s, size);

  return crypto.subtle.verify(
    { name: 'ECDSA', hash },
    key.getCryptoKey(),
    rs,
    data
  );
}

function trimSignByte(bytes: Uint8Array): Uint8Array {
  if (
    bytes.length > 1 &&
    bytes.length % 16 === 1 &&
    bytes[0] === 0x00 &&
    bytes[1] >= 0x80
  ) {
    return bytes.slice(1);
  }
  return bytes;
}

function padZeros(bytes: Uint8Array, len: number): Uint8Array {
  if (bytes.length > len) {
    throw new Error(
      `Invalid signature size, expected <= ${len}, received ${bytes.length}`
    );
  }
  if (bytes.length === len) {
    return bytes;
  }
  const padded = new Uint8Array(len);
  padded.set(bytes, len - bytes.length);
  return padded;
}
