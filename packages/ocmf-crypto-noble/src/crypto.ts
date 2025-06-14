import {
  CryptoAdapter,
  Hash,
  PrivateKeyFormat,
  PublicKeyFormat,
  SignatureFormat,
} from '@road-labs/ocmf-crypto';
import { EcPrivateKey } from './private-key';
import { EcPublicKey } from './public-key';
import sign from './sign';
import verify from './verify';

export class Crypto implements CryptoAdapter {
  async decodeEcPrivateKey(
    value: Uint8Array,
    format: PrivateKeyFormat
  ): Promise<EcPrivateKey> {
    return EcPrivateKey.fromEncoded(value, format);
  }

  async decodeEcPublicKey(
    value: Uint8Array,
    format: PublicKeyFormat
  ): Promise<EcPublicKey> {
    return EcPublicKey.fromEncoded(value, format);
  }

  async sign(
    data: Uint8Array,
    privateKey: EcPrivateKey,
    hash: Hash,
    format: SignatureFormat
  ): Promise<Uint8Array> {
    return sign(data, privateKey, hash, format);
  }

  async verify(
    signature: Uint8Array,
    data: Uint8Array,
    publicKey: EcPublicKey,
    hash: Hash,
    format: SignatureFormat
  ): Promise<boolean> {
    return verify(signature, data, publicKey, hash, format);
  }
}
