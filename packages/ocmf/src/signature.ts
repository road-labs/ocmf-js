import { Curve, Hash } from '@road-labs/ocmf-crypto';

export type SignatureMethodId =
  | 'ECDSA-brainpool256r1-SHA256'
  | 'ECDSA-brainpool384r1-SHA256'
  | 'ECDSA-secp192k1-SHA256'
  | 'ECDSA-secp192r1-SHA256'
  | 'ECDSA-secp256k1-SHA256'
  | 'ECDSA-secp256r1-SHA256'
  | 'ECDSA-secp384r1-SHA256';

export type SignatureMethod = {
  id: SignatureMethodId;
  algorithm: string;
  curve: Curve;
  hash: Hash;
};

const signatureMethods: SignatureMethod[] = [
  {
    id: 'ECDSA-secp192r1-SHA256',
    algorithm: 'ECDSA',
    curve: 'secp192r1',
    hash: 'SHA-256',
  },
  {
    id: 'ECDSA-secp192k1-SHA256',
    algorithm: 'ECDSA',
    curve: 'secp192k1',
    hash: 'SHA-256',
  },
  {
    id: 'ECDSA-secp256r1-SHA256',
    algorithm: 'ECDSA',
    curve: 'secp256r1',
    hash: 'SHA-256',
  },
  {
    id: 'ECDSA-secp256k1-SHA256',
    algorithm: 'ECDSA',
    curve: 'secp256k1',
    hash: 'SHA-256',
  },
  {
    id: 'ECDSA-secp384r1-SHA256',
    algorithm: 'ECDSA',
    curve: 'secp384r1',
    hash: 'SHA-256',
  },
  {
    id: 'ECDSA-brainpool256r1-SHA256',
    algorithm: 'ECDSA',
    curve: 'brainpool256r1',
    hash: 'SHA-256',
  },
  {
    id: 'ECDSA-brainpool384r1-SHA256',
    algorithm: 'ECDSA',
    curve: 'brainpool384r1',
    hash: 'SHA-256',
  },
];

export function signatureMethodFromId(id: SignatureMethodId): SignatureMethod {
  const signatureMethod = signatureMethods.find(
    (signature) => signature.id === id
  );
  if (!signatureMethod) {
    throw new Error(`Unsupported signature method: ${id}`);
  }
  return signatureMethod;
}
