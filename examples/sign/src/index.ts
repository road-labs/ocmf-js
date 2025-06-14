import { Crypto as NodeCrypto } from '@road-labs/ocmf-crypto-node';
import { Crypto as NobleCrypto } from '@road-labs/ocmf-crypto-noble';
import { Crypto as WebCrypto } from '@road-labs/ocmf-crypto-web';
import { PayloadData, Signer } from '@road-labs/ocmf';
import { CryptoAdapter } from '@road-labs/ocmf-crypto';

const cryptoBackend = process.env.OCMF_JS_CRYPTO_BACKEND || 'node';

(async () => {
  const payloadData: PayloadData = {
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
    IF: ['RFID_PLAIN', 'OCPP_RS_TLS'],
    IT: 'ISO14443',
    ID: '79A94A26862469',
    CI: 'CSONE',
    CT: 'CBIDC',
    RD: [
      {
        TM: '2025-06-14T08:44:54,562+0100 S',
        TX: 'B',
        RV: 0.75727,
        RI: '1-b',
        RU: 'kWh',
        ST: 'G',
      },
      {
        TM: '2025-06-14T11:44:54,562+0100 S',
        TX: 'E',
        RV: 3.12961,
        RI: '1-b',
        RU: 'kWh',
        ST: 'G',
      },
    ],
  };
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

  const rawPrivateKey =
    '308193020100301306072A8648CE3D020106082A8648CE3D0301070479307702010104207C6D5BE11771D1A54976443488A02F1796C6BFFA8FE76DA83368E92CA9875C9CA00A06082A8648CE3D030107A14403420004BE3D5E2505B5B207A6357147C49A915EEEACE51771C970202652D57CCB086FE9B46FFB794E0F241CA02935583D2A10A60A75675C2631863E603FB88D413284F5';
  const signatureMethodId = 'ECDSA-secp256r1-SHA256';

  const privateKey = await crypto.decodeEcPrivateKey(
    Buffer.from(rawPrivateKey, 'hex'),
    'pkcs8-der'
  );

  const signer = new Signer(crypto);
  const result = await signer.sign(payloadData, privateKey, signatureMethodId);

  const hexPublicKey = Buffer.from(
    (await privateKey?.getPublicKey()?.encode('spki-der')) || []
  )
    .toString('hex')
    .toUpperCase();

  console.log(`crypto: ${cryptoBackend}`);
  console.log(`signatureMethodId: ${signatureMethodId}`);
  console.log(`publicKey: ${hexPublicKey}`);
  console.log(`result: ${result}`);

  /*
  Output:
    crypto: node
    signatureMethodId: ECDSA-secp256r1-SHA256
    publicKey: 3059301306072A8648CE3D020106082A8648CE3D03010703420004BE3D5E2505B5B207A6357147C49A915EEEACE51771C970202652D57CCB086FE9B46FFB794E0F241CA02935583D2A10A60A75675C2631863E603FB88D413284F5
    result: OCMF|{"FV":"1.0","GI":"TEST","GS":"1234567","GV":"1.0.0","PG":"T1","MV":"MV","MM":"MM","MS":"1234567","MF":"1.0","IS":true,"IL":"VERIFIED","IF":["RFID_PLAIN","OCPP_RS_TLS"],"IT":"ISO14443","ID":"79A94A26862469","CI":"CSONE","CT":"CBIDC","RD":[{"TM":"2025-06-14T08:44:54,562+0100 S","TX":"B","RV":0.75727,"RI":"1-b","RU":"kWh","ST":"G"},{"TM":"2025-06-14T11:44:54,562+0100 S","TX":"E","RV":3.12961,"RI":"1-b","RU":"kWh","ST":"G"}]}|{"SA":"ECDSA-secp256r1-SHA256","SD":"304502201076A7EE27BE3AC1751BDEDB3932A7ABDFFBBD07D6E486509CFC3C41605A4B14022100D729071FBF70F095A1398E601DBEEF5B63322C42326EA89FCA4357B6DBB34135"}
  */
})();
