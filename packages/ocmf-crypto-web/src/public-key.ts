import {
  Curve,
  decodePkixSubjectPublicKeyInfo,
  oidToCurve,
  PublicKeyFormat,
  UnsupportedCurveError,
  UnsupportedPublicKeyFormatError,
} from '@road-labs/ocmf-crypto';
import { mapCurveToWebCryptoCurve } from './curve';

export class EcPublicKey {
  constructor(
    private readonly cryptoKey: CryptoKey,
    private readonly curve: Curve
  ) {}

  public getCryptoKey(): CryptoKey {
    return this.cryptoKey;
  }

  public getCurve(): Curve {
    return this.curve;
  }

  /**
   * @param value - The encoded value
   * @param format - The format the value is encoded in
   */
  static async fromEncoded(
    value: Uint8Array,
    format: PublicKeyFormat
  ): Promise<EcPublicKey> {
    if (format !== 'spki-der') {
      throw new UnsupportedPublicKeyFormatError(`Unknown format: ${format}`);
    }

    const keyInfo = decodePkixSubjectPublicKeyInfo(value);

    const namedCurve = keyInfo.algorithm.parameters?.namedCurve;
    if (!namedCurve) {
      throw new Error(`Named curve not specified`);
    }

    const curve = oidToCurve.get(namedCurve);
    if (!curve) {
      throw new UnsupportedCurveError(`Unknown curve: oid=${namedCurve}`);
    }

    const cryptoKey = await crypto.subtle.importKey(
      'spki',
      value,
      {
        name: 'ECDSA',
        namedCurve: mapCurveToWebCryptoCurve(curve),
      },
      true,
      ['verify']
    );

    return new EcPublicKey(cryptoKey, curve);
  }

  /**
   * @param format - Format for the public key to be encoded in
   */
  public async encode(format: PublicKeyFormat): Promise<Uint8Array> {
    if (format !== 'spki-der') {
      throw new UnsupportedPublicKeyFormatError(`Unknown format: ${format}`);
    }

    const exportedKey = await crypto.subtle.exportKey('spki', this.cryptoKey);

    return new Uint8Array(exportedKey);
  }
}
