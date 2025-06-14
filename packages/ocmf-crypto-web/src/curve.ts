import { Curve, UnsupportedCurveError } from '@road-labs/ocmf-crypto';

export function mapCurveToWebCryptoCurve(curve: Curve): string {
  switch (curve) {
    case 'secp256r1':
      return 'P-256';
    case 'secp384r1':
      return 'P-384';
    default:
      throw new UnsupportedCurveError(
        `Curve ${curve} is not supported by webcrypto`
      );
  }
}

export function getGroupOrderSize(curve: Curve): number {
  switch (curve) {
    case 'secp256r1':
      return 32;
    case 'secp384r1':
      return 48;
    default:
      throw new UnsupportedCurveError(
        `Curve ${curve} is not supported by webcrypto`
      );
  }
}
