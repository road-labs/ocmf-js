import {
  Curve,
  curveToOid,
  decodePkixSubjectPublicKeyInfo,
  encodePkixSubjectPublicKeyInfo,
  oidEllipticCurveKey,
  oidToCurve,
  PublicKeyFormat,
  UnsupportedCurveError,
  UnsupportedPublicKeyFormatError,
} from '@road-labs/ocmf-crypto';

export class EcPublicKey {
  constructor(
    private readonly value: Uint8Array,
    private readonly curve: Curve
  ) {}

  public getValue(): Uint8Array {
    return this.value;
  }

  public getCurve(): Curve {
    return this.curve;
  }

  static fromEncoded(value: Uint8Array, format: PublicKeyFormat): EcPublicKey {
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

    return new EcPublicKey(keyInfo.subjectPublicKey, curve);
  }

  public encode(format: PublicKeyFormat): Uint8Array {
    if (format !== 'spki-der') {
      throw new UnsupportedPublicKeyFormatError(`Unknown format: ${format}`);
    }

    const namedCurve = curveToOid.get(this.curve);
    if (!namedCurve) {
      throw new Error(`Failed to map curve to OID: ${this.curve}`);
    }

    return encodePkixSubjectPublicKeyInfo({
      algorithm: {
        algorithm: oidEllipticCurveKey,
        parameters: {
          namedCurve,
        },
      },
      subjectPublicKey: this.value,
    });
  }
}
