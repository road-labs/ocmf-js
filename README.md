# ocmf-js

A TypeScript/JavaScript implementation of
the [Open Charge Metering Format (OCMF)](https://github.com/SAFE-eV/OCMF-Open-Charge-Metering-Format) specification.
Both signing and verification functionality is available.

## Installation

Using your favourite package manager:

- [npm](https://docs.npmjs.com/) - `npm install @road-labs/ocmf`
- [yarn](https://yarnpkg.com/)  - `yarn add @road-labs/ocmf`
- [pnpm](https://pnpm.io/) - `pnpm add @road-labs/ocmf`

Note that package to cover crypto related functionality will also need to be installed, discussed below.

## Dependencies

The OCMF specification requires Eliptic Curve Cryptography (ECC) functions for singing and verification. Within the
JavaScript ecosystem, there are various offerings on this front; these typically have certain limitations. We have
implemented backends around three typical options on this front - make a choice based on the platform you're using,
required coverage of signature methods, and any security considerations.

| package                                                                         | platforms       | implementation  | supported signatures                           | remarks                                                                     |
|---------------------------------------------------------------------------------|-----------------|-----------------|------------------------------------------------|-----------------------------------------------------------------------------|
| [ocmf-crypto-noble](https://www.npmjs.com/package/@road-labs/ocmf-crypto-noble) | nodejs, browser | pure javascript | All specified by OCMF                          | Audited JS implementation                                                   |
| [ocmf-crypto-node](https://www.npmjs.com/package/@road-labs/ocmf-crypto-node)   | nodejs          | native          | All specified by OCMF                          | Browser use may be possible via crypto-browserify, but this not recommended |
| [ocmf-crypto-web](https://www.npmjs.com/package/@road-labs/ocmf-crypto-web)     | nodejs, browser | native          | ECDSA-secp256r1-SHA256, ECDSA-secp384r1-SHA256 | Limited curves available                                                    |

## Usage

### Signing

```typescript
import { PayloadData, Signer } from '@road-labs/ocmf';
import { Crypto } from '@road-labs/ocmf-crypto-node';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-noble';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-web';

const ecCrypto = new Crypto();
const signer = new Signer(ecCrypto);

const rawPrivateKey = Buffer.from('<pkcs8-private-key-in-hex>', 'hex');
const privateKey = await ecCrypto.decodeEcPrivateKey(rawPrivateKey, 'pkcs8-der');
const signatureMethodId = 'ECDSA-secp256r1-SHA256';

const signature = await signer.sign(
  {
    PG: 'T1',
    MS: '1234567',
    IS: true,
    IT: 'ISO14443',
    RD: [
      { TM: '2025-06-14T08:44:54,562+0100 S', TX: 'B', RV: 0.75, RU: 'kWh', ST: 'G' },
      { TM: '2025-06-14T11:44:54,562+0100 S', TX: 'E', RV: 3.12, RU: 'kWh', ST: 'G' },
    ],
  },
  privateKey,
  signatureMethodId
);
```

A more complete working example is available under [examples/verify](./examples/verify);

### Verification

```typescript
import { PayloadData, Signer } from '@road-labs/ocmf';
import { Crypto } from '@road-labs/ocmf-crypto-node';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-noble';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-web';

const ecCrypto = new Crypto();
const verifier = new Verifier(ecCrypto);

const rawPublicKey = Buffer.from('<spki-public-key-in-hex>', 'hex');
const publicKey = await ecCrypto.decodeEcPublicKey(rawPublicKey, 'spki-der');
const signedData = 'OCMF|{"FV":"1.0","GI":"TEST","GS":"1234567"}|{"SA":"ECDSA-secp256r1-SHA256","SD":"0102030405"}';

const result = await verifier.parseAndVerify(signedData, publicKey);

if (result.verified) {
  // Success
}
```

A more complete working example is available under [examples/sign](./examples/sign);
