import { EcPublicKey } from './public-key';
import {
  Curve,
  decodePkcs8PrivateKeyInfo,
  oidToCurve,
  PrivateKeyFormat,
  UnsupportedCurveError,
} from '@road-labs/ocmf-crypto';

export class EcPrivateKey {
  private constructor(
    private readonly value: Uint8Array,
    private readonly curve: Curve,
    private readonly publicKey: EcPublicKey | null
  ) {}

  public getValue(): Uint8Array {
    return this.value;
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

    const keyInfo = decodePkcs8PrivateKeyInfo(value);

    const namedCurve = keyInfo?.privateKey?.parameters?.namedCurve;
    if (!namedCurve) {
      throw new Error(`Named curve not specified`);
    }

    const curve = oidToCurve.get(namedCurve);
    if (!curve) {
      throw new UnsupportedCurveError(`Unknown curve: oid=${namedCurve}`);
    }

    let publicKey: EcPublicKey | null = null;
    if (keyInfo.privateKey.publicKey) {
      publicKey = new EcPublicKey(keyInfo.privateKey.publicKey, curve);
    }

    return new EcPrivateKey(keyInfo.privateKey.privateKey, curve, publicKey);
  }
}
