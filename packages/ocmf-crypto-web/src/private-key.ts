import { EcPublicKey } from './public-key';
import {
  Curve,
  decodePkcs8PrivateKeyInfo,
  oidToCurve,
  PrivateKeyFormat,
  UnsupportedCurveError,
} from '@road-labs/ocmf-crypto';
import { mapCurveToWebCryptoCurve } from './curve';

export class EcPrivateKey {
  private constructor(
    private readonly cryptoKey: CryptoKey,
    private readonly curve: Curve,
    private readonly publicKey: EcPublicKey | null
  ) {}

  public getCryptoKey(): CryptoKey {
    return this.cryptoKey;
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
  static async fromEncoded(
    value: Uint8Array,
    format: PrivateKeyFormat
  ): Promise<EcPrivateKey> {
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

    const webCryptoCurve = mapCurveToWebCryptoCurve(curve);

    const privateCryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      value,
      {
        name: 'ECDSA',
        namedCurve: webCryptoCurve,
      },
      true,
      ['sign']
    );

    const publicCryptoKey = await EcPrivateKey.derivePublicKey(
      privateCryptoKey,
      webCryptoCurve
    );

    let publicKey: EcPublicKey | null = null;
    if (publicCryptoKey) {
      publicKey = new EcPublicKey(publicCryptoKey, curve);
    }

    return new EcPrivateKey(privateCryptoKey, curve, publicKey);
  }

  private static async derivePublicKey(
    privateCryptoKey: CryptoKey,
    webCryptoCurve: string
  ): Promise<CryptoKey | null> {
    const privateKeyInfo = decodePkcs8PrivateKeyInfo(
      new Uint8Array(await crypto.subtle.exportKey('pkcs8', privateCryptoKey))
    );
    if (!privateKeyInfo.privateKey.publicKey) {
      return null;
    }
    return crypto.subtle.importKey(
      'raw',
      privateKeyInfo.privateKey.publicKey,
      {
        name: 'ECDSA',
        namedCurve: webCryptoCurve,
      },
      true,
      ['verify']
    );
  }
}
