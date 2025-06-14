import {
  Curve,
  Hash,
  PrivateKeyFormat,
  PublicKeyFormat,
  SignatureFormat,
} from './types';

export class UnsupportedCurveError extends Error {}
export class UnsupportedHashError extends Error {}
export class UnsupportedPrivateKeyFormatError extends Error {}
export class UnsupportedPublicKeyFormatError extends Error {}
export class UnsupportedSignatureFormatError extends Error {}

export interface CryptoAdapter {
  /**
   * @param value - Encoded private key value
   * @param format - Encoding format
   * @return A private key instance
   * @throws UnsupportedCurveError
   * @throws UnsupportedPrivateKeyFormatError
   * @throws Error
   */
  decodeEcPrivateKey(
    value: Uint8Array,
    format: PrivateKeyFormat
  ): EcPrivateKey | Promise<EcPrivateKey>;

  /**
   * @param value - Encoded public key value
   * @param format - Encoding format
   * @return A public key instance
   * @throws UnsupportedCurveError
   * @throws UnsupportedPublicKeyFormatError
   * @throws Error
   */
  decodeEcPublicKey(
    value: Uint8Array,
    format: PublicKeyFormat
  ): EcPublicKey | Promise<EcPublicKey>;

  /**
   * @param data - Data to be signed
   * @param privateKey - Private key to use for signing
   * @param hash - Hash to apply
   * @param format - Format to return the signature in
   * @return Signature encoded in the specified format
   * @throws UnsupportedHashError
   * @throws UnsupportedSignatureFormatError
   * @throws Error
   */
  sign(
    data: Uint8Array,
    privateKey: EcPrivateKey,
    hash: Hash,
    format: SignatureFormat
  ): Uint8Array | Promise<Uint8Array>;

  /**
   * @param signature - X.509 ECDSASigValue ASN.1 type DER encoded
   * @param data - Raw value
   * @param key - The public key to verify against
   * @param hash - Hash to apply
   * @param format - Format the signature is encoded in
   * @return true if the signature is valid
   * @throws UnsupportedSignatureFormatError
   * @throws Error
   */
  verify(
    signature: Uint8Array,
    data: Uint8Array,
    key: EcPublicKey,
    hash: Hash,
    format: SignatureFormat
  ): boolean | Promise<boolean>;
}

export interface EcPublicKey {
  /**
   * @return The curve of the public key
   */
  getCurve(): Curve;

  /**
   * @param format - Format to encode with
   * @return Encoded public key
   */
  encode(format: PublicKeyFormat): Uint8Array | Promise<Uint8Array>;
}

export interface EcPrivateKey {
  /**
   * @return The curve of the private key
   */
  getCurve(): Curve;

  /**
   * @return The public key, if available
   */
  getPublicKey(): EcPublicKey | null;
}
