import { EcPublicKey } from './public-key';
import {
  Curve,
  PrivateKeyFormat,
  UnsupportedCurveError,
} from '@road-labs/ocmf-crypto';
import crypto, { KeyObject } from 'crypto';
import { mapNodeCryptoCurveToCurve } from './curve';

export class EcPrivateKey {
  private constructor(
    private readonly keyObject: KeyObject,
    private readonly curve: Curve,
    private readonly publicKey: EcPublicKey | null
  ) {}

  public getKeyObject(): KeyObject {
    return this.keyObject;
  }

  public getCurve(): Curve {
    return this.curve;
  }

  public getPublicKey(): EcPublicKey | null {
    return this.publicKey;
  }

  /**
   * @param value - Encoded private key value
   * @param format - Encoding format
   */
  static fromEncoded(
    value: Uint8Array,
    format: PrivateKeyFormat
  ): EcPrivateKey {
    if (format !== 'pkcs8-der') {
      throw new Error(`Unsupported format: ${format}`);
    }

    const privateKeyObject = crypto.createPrivateKey({
      key: Buffer.from(value),
      format: 'der',
      type: 'pkcs8',
    });

    if (privateKeyObject.asymmetricKeyType !== 'ec') {
      throw new Error(
        `Unsupported key type: ${privateKeyObject.asymmetricKeyType}`
      );
    }

    const { namedCurve } = privateKeyObject.asymmetricKeyDetails || {};
    if (!namedCurve) {
      throw new Error(`Named curve not specified`);
    }

    const curve = mapNodeCryptoCurveToCurve(namedCurve);
    if (!curve) {
      throw new UnsupportedCurveError(`Unknown curve: ${namedCurve}`);
    }

    const publicKeyObject = crypto.createPublicKey(privateKeyObject);

    let publicKey: EcPublicKey | null = null;
    if (publicKeyObject) {
      publicKey = new EcPublicKey(publicKeyObject, curve);
    }

    return new EcPrivateKey(privateKeyObject, curve, publicKey);
  }
}
