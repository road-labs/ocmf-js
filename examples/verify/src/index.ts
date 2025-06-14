import { Crypto as NodeCrypto } from '@road-labs/ocmf-crypto-node';
import { Crypto as NobleCrypto } from '@road-labs/ocmf-crypto-noble';
import { Crypto as WebCrypto } from '@road-labs/ocmf-crypto-web';
import { Verifier } from '@road-labs/ocmf';
import { CryptoAdapter } from '@road-labs/ocmf-crypto';

const cryptoBackend = process.env.OCMF_JS_CRYPTO_BACKEND || 'node';

(async () => {
  let crypto: CryptoAdapter;
  switch (cryptoBackend) {
    case 'noble':
      crypto = new NobleCrypto();
      break;
    case 'node':
      crypto = new NodeCrypto();
      break;
    case 'web':
      crypto = new WebCrypto();
      break;
    default:
      throw new Error(`Unknown crypto backed: ${cryptoBackend}`);
  }

  const rawPublicKey =
    '3059301306072A8648CE3D020106082A8648CE3D03010703420004EF1766AFD940A49FBA863779837F394EB053BF87DB529DE69FDDE8B32485D7AD715CD8F291656B1DEAA29337A65E4B1B7F9F2808E4E53019B867D4C9294948C9';
  const signedData =
    'OCMF|{"FV":"1.0","GI":"TEST","GS":"1234567","GV":"1.0.0","PG":"T1","MV":"MV","MM":"MM","MS":"1234567","MF":"1.0","IS":true,"IL":"VERIFIED","IF":["RFID_PLAIN","OCPP_RS_TLS"],"IT":"ISO14443","ID":"2AB46E883AD3BB","CI":"CSONE","CT":"CBIDC","RD":[{"TM":"2025-06-14T08:49:47,642+0100 S","TX":"B","RV":0.56698,"RI":"1-b","RU":"kWh","EI":1523,"ST":"G"},{"TM":"2025-06-14T11:49:47,642+0100 S","TX":"E","RV":8.36706,"RI":"1-b","RU":"kWh","EI":1523,"ST":"G"}]}|{"SA":"ECDSA-secp256r1-SHA256","SD":"3045022100DB41C0B8AC1580F274574DC8A5C9AD856C1A4B0D5BF2252D119F55202E363968022053BD9DBE36DF6EF1F712C76A0E12F80E8B7E614683375C046371871E128B9BA3"}';

  const publicKey = await crypto.decodeEcPublicKey(
    Buffer.from(rawPublicKey, 'hex'),
    'spki-der'
  );

  const verifier = new Verifier(crypto);
  const result = await verifier.parseAndVerify(signedData, publicKey);

  console.log(`crypto: ${cryptoBackend}`);
  console.log(`signatureMethodId: ${result?.value?.signature?.SA}`);
  console.log(`verified: ${result.verified}`);
  console.log(`value:`, result.value);

  /*
  Output:
    crypto: node
    signatureMethodId: ECDSA-secp256r1-SHA256
    verified: true
    value: {
      header: 'OCMF',
      payloadData: {
        FV: '1.0',
        GI: 'TEST',
        GS: '1234567',
        GV: '1.0.0',
        PG: 'T1',
        MV: 'MV',
        MM: 'MM',
        MS: '1234567',
        MF: '1.0',
        IS: true,
        IL: 'VERIFIED',
        IF: [ 'RFID_PLAIN', 'OCPP_RS_TLS' ],
        IT: 'ISO14443',
        ID: '2AB46E883AD3BB',
        CI: 'CSONE',
        CT: 'CBIDC',
        RD: [ [Object], [Object] ]
      },
      signature: {
        SA: 'ECDSA-secp256r1-SHA256',
        SD: '3045022100DB41C0B8AC1580F274574DC8A5C9AD856C1A4B0D5BF2252D119F55202E363968022053BD9DBE36DF6EF1F712C76A0E12F80E8B7E614683375C046371871E128B9BA3'
      }
    }
   */
})();
