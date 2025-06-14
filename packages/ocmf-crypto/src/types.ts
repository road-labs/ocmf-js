export type Curve =
  | 'brainpool256r1'
  | 'brainpool384r1'
  | 'secp192k1'
  | 'secp192r1'
  | 'secp256k1'
  | 'secp256r1'
  | 'secp384r1';

export type PrivateKeyFormat = 'pkcs8-der'; // PKCS#8 PrivateKeyInfo ASN.1 type DER encoded
export type PublicKeyFormat = 'spki-der'; // X.509 SubjectPublicKeyInfo ASN.1 type DER encoded
export type SignatureFormat = 'sigvalue-der'; // X.509 ECDSASigValue ASN.1 type DER encoded
export type Hash = 'SHA-256';
