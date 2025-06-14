import { AsnConvert, AsnParser } from '@peculiar/asn1-schema';
import { PrivateKeyInfo } from '@peculiar/asn1-pkcs8';
import {
  ECDSASigValue,
  ECParameters,
  ECPrivateKey,
  id_ecPublicKey,
  id_secp192r1,
  id_secp256r1,
  id_secp384r1,
} from '@peculiar/asn1-ecc';
import { AlgorithmIdentifier, SubjectPublicKeyInfo } from '@peculiar/asn1-x509';
import { Curve } from './types';

export const oidEllipticCurveKey = id_ecPublicKey;

const id_brainpool256r1 = '1.3.36.3.3.2.8.1.1.7';
const id_brainpool384r1 = '1.3.36.3.3.2.8.1.1.11';
const id_secp192k1 = '1.3.132.0.31';
const id_secp256k1 = '1.3.132.0.10';

export const oidToCurve = new Map<string, Curve>([
  [id_brainpool256r1, 'brainpool256r1'],
  [id_brainpool384r1, 'brainpool384r1'],
  [id_secp192k1, 'secp192k1'],
  [id_secp192r1, 'secp192r1'],
  [id_secp256k1, 'secp256k1'],
  [id_secp256r1, 'secp256r1'],
  [id_secp384r1, 'secp384r1'],
]);

export const curveToOid = new Map<Curve, string>([
  ['brainpool256r1', id_brainpool256r1],
  ['brainpool384r1', id_brainpool384r1],
  ['secp192k1', id_secp192k1],
  ['secp192r1', id_secp192r1],
  ['secp256k1', id_secp256k1],
  ['secp256r1', id_secp256r1],
  ['secp384r1', id_secp384r1],
]);

export interface Pkcs8PrivateKeyInfo {
  version: number;
  privateKeyAlgorithm: {
    algorithm: string;
  };
  privateKey: {
    version: number;
    privateKey: Uint8Array;
    parameters?: {
      namedCurve?: string;
    };
    publicKey?: Uint8Array;
  };
}

export interface PkixSubjectPublicKeyInfo {
  algorithm: {
    algorithm: string;
    parameters?: {
      namedCurve?: string;
    };
  };
  subjectPublicKey: Uint8Array;
}

export interface PkixEcdsaSigValue {
  r: Uint8Array;
  s: Uint8Array;
}

export function decodePkcs8PrivateKeyInfo(
  value: Uint8Array
): Pkcs8PrivateKeyInfo {
  const privateKeyInfo = AsnParser.parse(value, PrivateKeyInfo);
  if (privateKeyInfo?.privateKeyAlgorithm?.algorithm !== oidEllipticCurveKey) {
    throw new Error(
      `Unexpected private key algorithm: ${privateKeyInfo?.privateKeyAlgorithm?.algorithm}`
    );
  }

  const privateKey = AsnParser.parse(
    privateKeyInfo.privateKey.buffer,
    ECPrivateKey
  );

  return {
    version: privateKeyInfo.version,
    privateKeyAlgorithm: privateKeyInfo.privateKeyAlgorithm,
    privateKey: {
      version: privateKey.version,
      parameters: privateKey.parameters,
      privateKey: new Uint8Array(privateKey.privateKey.buffer),
      publicKey: privateKey.publicKey
        ? new Uint8Array(privateKey.publicKey)
        : undefined,
    },
  };
}

export function encodePkixSubjectPublicKeyInfo(
  keyInfo: PkixSubjectPublicKeyInfo
): Uint8Array {
  const asn1 = new SubjectPublicKeyInfo({
    algorithm: new AlgorithmIdentifier({
      algorithm: keyInfo.algorithm.algorithm,
      parameters: AsnConvert.serialize(
        new ECParameters(keyInfo.algorithm.parameters)
      ),
    }),
    subjectPublicKey: keyInfo.subjectPublicKey,
  });
  return new Uint8Array(AsnConvert.serialize(asn1));
}

export function decodePkixSubjectPublicKeyInfo(
  value: Uint8Array
): PkixSubjectPublicKeyInfo {
  const subjectPublicKeyInfo = AsnParser.parse(value, SubjectPublicKeyInfo);
  if (subjectPublicKeyInfo?.algorithm?.algorithm !== oidEllipticCurveKey) {
    throw new Error(
      `Unexpected public key algorithm: ${subjectPublicKeyInfo?.algorithm?.algorithm}`
    );
  }

  let parameters: PkixSubjectPublicKeyInfo['algorithm']['parameters'];
  if (subjectPublicKeyInfo.algorithm.parameters) {
    parameters = AsnParser.parse(
      subjectPublicKeyInfo.algorithm.parameters,
      ECParameters
    );
  }

  return {
    algorithm: {
      algorithm: subjectPublicKeyInfo.algorithm.algorithm,
      parameters,
    },
    subjectPublicKey: new Uint8Array(subjectPublicKeyInfo.subjectPublicKey),
  };
}

export function encodePkixEcdsaSigValue(
  sigValue: PkixEcdsaSigValue
): Uint8Array {
  const asn1 = new ECDSASigValue({
    r: sigValue.r,
    s: sigValue.s,
  });
  return new Uint8Array(AsnConvert.serialize(asn1));
}

export function decodePkixEcdsaSigValue(value: Uint8Array): PkixEcdsaSigValue {
  const subjectPublicKeyInfo = AsnParser.parse(value, ECDSASigValue);
  return {
    r: new Uint8Array(subjectPublicKeyInfo.r),
    s: new Uint8Array(subjectPublicKeyInfo.s),
  };
}
