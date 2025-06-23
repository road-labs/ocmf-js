# @road-labs/ocmf-crypto-web

This module is a crypto backend for [@road-labs/ocmf](https://www.npmjs.com/package/@road-labs/ocmf)

## Features

- Supported platforms: nodejs, browser
- ECC backend: [Web Crypto API](https://w3c.github.io/webcrypto/)
- Supported signature methods: ECDSA-secp256r1-SHA256, ECDSA-secp384r1-SHA256

The Web Crypto API is a unified API that is supported by both Node.js and browsers. The curve support is very limited,
meaning only 2 signature methods are supported.