import {
  Curve,
  PublicKeyFormat,
  UnsupportedCurveError,
  UnsupportedPublicKeyFormatError,
} from '@road-labs/ocmf-crypto';
import { mapNodeCryptoCurveToCurve } from './curve';
import crypto, { KeyObject } from 'crypto';

export class EcPublicKey {
  constructor(
    private readonly keyObject: KeyObject,
    private readonly curve: Curve
  ) {}

  public getKeyObject(): KeyObject {
    return this.keyObject;
  }

  public getCurve(): Curve {
    return this.curve;
  }

  /**
   * @param value - The encoded value
   * @param format - The format the value is encoded in
   */
  static fromEncoded(value: Uint8Array, format: PublicKeyFormat): EcPublicKey {
    if (format !== 'spki-der') {
      throw new UnsupportedPublicKeyFormatError(`Unknown format: ${format}`);
    }

    const publicKeyObject = crypto.createPublicKey({
      key: Buffer.from(value),
      format: 'der',
      type: 'spki',
    });

    if (publicKeyObject.asymmetricKeyType !== 'ec') {
      throw new Error(
        `Unsupported key type: ${publicKeyObject.asymmetricKeyType}`
      );
    }

    const { namedCurve } = publicKeyObject.asymmetricKeyDetails || {};
    if (!namedCurve) {
      throw new Error('Named curve not specified');
    }

    const curve = mapNodeCryptoCurveToCurve(namedCurve);
    if (!curve) {
      throw new UnsupportedCurveError(`Unknown curve: ${namedCurve}`);
    }

    return new EcPublicKey(publicKeyObject, curve);
  }

  /**
   * @param format - Format for the public key to be encoded in
   */
  public encode(format: PublicKeyFormat): Uint8Array {
    if (format !== 'spki-der') {
      throw new UnsupportedPublicKeyFormatError(`Unknown format: ${format}`);
    }

    const exportedKey = this.keyObject.export({
      type: 'spki',
      format: 'der',
    });

    return new Uint8Array(exportedKey);
  }
}
