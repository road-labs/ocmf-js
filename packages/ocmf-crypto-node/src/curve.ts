import { Curve } from '@road-labs/ocmf-crypto';

const cryptoCurveToCurve = new Map<string, Curve>([
  ['prime192v1', 'secp192r1'],
  ['secp192k1', 'secp192k1'],
  ['prime256v1', 'secp256r1'],
  ['secp256k1', 'secp256k1'],
  ['secp384r1', 'secp384r1'],
  ['brainpoolP256r1', 'brainpool256r1'],
  ['brainpoolP384r1', 'brainpool384r1'],
]);

export function mapNodeCryptoCurveToCurve(cryptoCurve: string): Curve {
  const curve = cryptoCurveToCurve.get(cryptoCurve);
  if (!curve) {
    throw new Error(`Unrecognized curve: ${cryptoCurve}`);
  }
  return curve;
}
