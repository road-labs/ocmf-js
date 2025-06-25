import {
  Curve,
  decodePkixSubjectPublicKeyInfo,
  oidEllipticCurveKey,
  oidToCurve,
  PkixSubjectPublicKeyInfo,
} from '@road-labs/ocmf-crypto';
import { hexToBytes } from './utils';

const testCases: { name: string; curve: Curve; spki: string }[] = [
  {
    name: 'brainpool256r1',
    curve: 'brainpool256r1',
    spki: '305A301406072A8648CE3D020106092B24030302080101070342000469C661761E9D9A110AEE98614E1872792FB3F02EFD6BA5281AEED04F190374B725606605EB86F5BC57BAF72CDBAC442C48F534E7EC51F36DBEBDF55A139A311D',
  },
  {
    name: 'brainpool384r1',
    curve: 'brainpool384r1',
    spki: '307A301406072A8648CE3D020106092B240303020801010B03620004640466CC299698E2349063BE542B25C2CC59534B4299E36438F15FA811E7ADF02AF57F854EFF06DE9AA89DE1667091B727CB8C2067A5BB463789175B152E5C032E38E0E61C04DF0AAB11B5BC2D0950513FDA4D201BCC9747D19EF290D57C40B7',
  },
  {
    name: 'secp192k1',
    curve: 'secp192k1',
    spki: '3046301006072A8648CE3D020106052B8104001F033200041D13138B8BE0365FF04D93484CF801BCAB219D37E3D92763A03E8CEF934E47EE8E3CB083FACD2E6F92BE6BD7EE51043E',
  },
  {
    name: 'secp192r1',
    curve: 'secp192r1',
    spki: '3049301306072A8648CE3D020106082A8648CE3D0301010332000409937051869B2F02A0162DB8C57303B11935A540060F99626C6D85BD908058D4EC2CC3A6ECDEC78633D838E1EFE0A0B6',
  },
  {
    name: 'secp256k1',
    curve: 'secp256k1',
    spki: '3056301006072A8648CE3D020106052B8104000A03420004C89F37EE39862217A7D6FBC41E3CC2EF005BCAEDE815D4488CA0ABEFEDE69D34BDA4776DD7F25C7FBAE96C0E29877AEB52FB4132658D79C673B91E5F5D0B675F',
  },
  {
    name: 'secp256r1',
    curve: 'secp256r1',
    spki: '3059301306072A8648CE3D020106082A8648CE3D03010703420004BE3D5E2505B5B207A6357147C49A915EEEACE51771C970202652D57CCB086FE9B46FFB794E0F241CA02935583D2A10A60A75675C2631863E603FB88D413284F5',
  },
  {
    name: 'secp384r1',
    curve: 'secp384r1',
    spki: '3076301006072A8648CE3D020106052B81040022036200047EF8E6EBDA4153C5FE0925971EC6A1AA89A2CB5E4F9E9B21F5A9EAF634D062616E808B94EB28ACBA90A50773671C02BD509ACDBB1117E9136020611DBB93464EAD5E18158D2F05C489E605FD7629C6CC6316C600102CD755D91FA3F18627B340',
  },
];

export function buildPublicKeyTestCases(curves: Curve[]) {
  return testCases
    .filter((testCase) => curves.includes(testCase.curve))
    .map(({ name, curve, spki }) => ({
      name,
      curve,
      spki: hexToBytes(spki),
    }));
}

export function isValidPublicKey(raw: Uint8Array, curve: Curve): boolean {
  let publicKey: PkixSubjectPublicKeyInfo;
  try {
    publicKey = decodePkixSubjectPublicKeyInfo(raw);
  } catch (err) {
    console.warn(`Failed to decode SPKI: ${err}`);
    return false;
  }

  const expectedSize = (Number(curve.match(/[0-9]+/)?.pop()) % 7) * 8 * 2 + 1; // X|Y

  return (
    publicKey.subjectPublicKey.length === expectedSize &&
    publicKey.algorithm.algorithm === oidEllipticCurveKey &&
    publicKey.algorithm.parameters?.namedCurve !== undefined &&
    oidToCurve.get(publicKey.algorithm.parameters.namedCurve) === curve
  );
}
