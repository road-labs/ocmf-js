import { secp256k1 } from '@noble/curves/secp256k1';
import { secp256r1, secp384r1 } from '@noble/curves/nist';
import { Field } from '@noble/curves/abstract/modular';
import { sha256, sha384 } from '@noble/hashes/sha2';
import { Curve } from '@road-labs/ocmf-crypto';
import { CurveFn, weierstrass } from '@noble/curves/abstract/weierstrass';

const secp192r1 = weierstrass({
  a: BigInt('0xfffffffffffffffffffffffffffffffefffffffffffffffc'),
  b: BigInt('0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1'),
  Fp: Field(BigInt('0xfffffffffffffffffffffffffffffffeffffffffffffffff')),
  n: BigInt('0xffffffffffffffffffffffff99def836146bc9b1b4d22831'),
  Gx: BigInt('0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012'),
  Gy: BigInt('0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811'),
  h: BigInt(1),
  lowS: false,
  hash: sha256,
});

const secp192k1 = weierstrass({
  a: BigInt(0),
  b: BigInt(3),
  Fp: Field(BigInt('0xfffffffffffffffffffffffffffffffffffffffeffffee37')),
  n: BigInt('0xfffffffffffffffffffffffe26f2fc170f69466a74defd8d'),
  Gx: BigInt('0xdb4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d'),
  Gy: BigInt('0x9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d'),
  h: BigInt(1),
  lowS: false,
  hash: sha256,
});

const brainpool256r1 = weierstrass({
  a: BigInt(
    '0x7d5a0975fc2c3057eef67530417affe7fb8055c126dc5c6ce94a4b44f330b5d9'
  ),
  b: BigInt(
    '0x26dc5c6ce94a4b44f330b5d9bbd77cbf958416295cf7e1ce6bccdc18ff8c07b6'
  ),
  Fp: Field(
    BigInt('0xa9fb57dba1eea9bc3e660a909d838d726e3bf623d52620282013481d1f6e5377')
  ),
  n: BigInt(
    '0xa9fb57dba1eea9bc3e660a909d838d718c397aa3b561a6f7901e0e82974856a7'
  ),
  Gx: BigInt(
    '0x8bd2aeb9cb7e57cb2c4b482ffc81b7afb9de27e1e3bd23c23a4453bd9ace3262'
  ),
  Gy: BigInt(
    '0x547ef835c3dac4fd97f8461a14611dc9c27745132ded8e545c1d54c72f046997'
  ),
  h: BigInt(1),
  lowS: false,
  hash: sha256,
});

const brainpool384r1 = weierstrass({
  a: BigInt(
    '0x7bc382c63d8c150c3c72080ace05afa0c2bea28e4fb22787139165efba91f90f8aa5814a503ad4eb04a8c7dd22ce2826'
  ),
  b: BigInt(
    '0x4a8c7dd22ce28268b39b55416f0447c2fb77de107dcd2a62e880ea53eeb62d57cb4390295dbc9943ab78696fa504c11'
  ),
  Fp: Field(
    BigInt(
      '0x8cb91e82a3386d280f5d6f7e50e641df152f7109ed5456b412b1da197fb71123acd3a729901d1a71874700133107ec53'
    )
  ),
  n: BigInt(
    '0x8cb91e82a3386d280f5d6f7e50e641df152f7109ed5456b31f166e6cac0425a7cf3ab6af6b7fc3103b883202e9046565'
  ),
  Gx: BigInt(
    '0x1d1c64f068cf45ffa2a63a81b7c13f6b8847a3e77ef14fe3db7fcafe0cbd10e8e826e03436d646aaef87b2e247d4af1e'
  ),
  Gy: BigInt(
    '0x8abe1d7520f9c2a45cb1eb8e95cfd55262b70b29feec5864e19c054ff99129280e4646217791811142820341263c5315'
  ),
  h: BigInt(1),
  lowS: false,
  hash: sha384,
});

export function resolveCurveFn(curve: Curve): CurveFn {
  switch (curve) {
    case 'secp192r1':
      return secp192r1;
    case 'secp192k1':
      return secp192k1;
    case 'secp256k1':
      return secp256k1;
    case 'secp256r1':
      return secp256r1;
    case 'secp384r1':
      return secp384r1;
    case 'brainpool256r1':
      return brainpool256r1;
    case 'brainpool384r1':
      return brainpool384r1;
    default:
      throw new Error(`Failed to resolve curve: ${curve}`);
  }
}
