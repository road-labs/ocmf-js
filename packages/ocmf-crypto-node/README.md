# @road-labs/ocmf-crypto-node

This module is a crypto backend for [@road-labs/ocmf](https://www.npmjs.com/package/@road-labs/ocmf)

## Features

- Supported platforms: nodejs
- ECC backend: nodejs [Crypto](https://nodejs.org/api/crypto.html) module
- Supported signature methods: all specified by OCMF

This may work with Deno too, untested. Note that browser use may be possible via the `crypto-browserify` package,
however this is also untested and generally discouraged.