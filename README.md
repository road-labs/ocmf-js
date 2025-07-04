# ocmf-js 🔏

A TypeScript/JavaScript implementation of
the [Open Charge Metering Format (OCMF)](https://github.com/SAFE-eV/OCMF-Open-Charge-Metering-Format) specification.

## Features

- Private key based signing of OCMF signed meter data
- Public key based verification of OCMF signed meter data
- Typescript type representation of the OCMF payload format
- Node.js and browser support

## Installation

Using your favourite package manager:

- [npm](https://docs.npmjs.com/) - `npm install @road-labs/ocmf`
- [yarn](https://yarnpkg.com/)  - `yarn add @road-labs/ocmf`
- [pnpm](https://pnpm.io/) - `pnpm add @road-labs/ocmf`

Note that package to cover crypto related functionality will also need to be installed, discussed below.

## Dependencies

The OCMF specification requires Elliptic Curve Cryptography (ECC) functions for signing and verification. Within the
JavaScript ecosystem, there are various offerings on this front; these often have certain limitations. We have
implemented backends around three typical options, listed below - make a choice based on the platform you're using,
required coverage of signature methods, and any security considerations:

- [@road-labs/ocmf-crypto-noble](./packages/ocmf-crypto-noble)
- [@road-labs/ocmf-crypto-node](./packages/ocmf-crypto-node)
- [@road-labs/ocmf-crypto-web](./packages/ocmf-crypto-web)

## Usage

### Signing

```typescript
import { PayloadData, Signer } from '@road-labs/ocmf';
import { Crypto } from '@road-labs/ocmf-crypto-node';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-noble';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-web';

const ocmfCrypto = new Crypto();
const ocmfSigner = new Signer(ocmfCrypto);

const rawPrivateKey = Buffer.from('<pkcs8-private-key-in-hex>', 'hex');
const privateKey = await ocmfCrypto.decodeEcPrivateKey(rawPrivateKey, 'pkcs8-der');
const signatureMethodId = 'ECDSA-secp256r1-SHA256';

const signature = await ocmfSigner.sign(
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

A more complete working example is available under [examples/sign](./examples/sign).

### Verification

```typescript
import { PayloadData, Signer } from '@road-labs/ocmf';
import { Crypto } from '@road-labs/ocmf-crypto-node';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-noble';
// ...or: import { Crypto } from '@road-labs/ocmf-crypto-web';

const ocmfCrypto = new Crypto();
const ocmfVerifier = new Verifier(ocmfCrypto);

const rawPublicKey = Buffer.from('<spki-public-key-in-hex>', 'hex');
const publicKey = await ocmfCrypto.decodeEcPublicKey(rawPublicKey, 'spki-der');
const signedData = 'OCMF|{"FV":"1.0","GI":"TEST","GS":"1234567"}|{"SA":"ECDSA-secp256r1-SHA256","SD":"0102030405"}';

const result = await ocmfVerifier.parseAndVerify(signedData, publicKey);

if (result.verified) {
  // Success, log the parsed OCMF payload
  console.log(result.value);
}
```

A more complete working example is available under [examples/verify](./examples/verify). Additionally, a browser based
example is available under [examples/web](./examples/web), which is also hosted at https://road-labs.github.io/ocmf-js/
