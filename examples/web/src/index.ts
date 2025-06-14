import { ParseAndVerifyResult, SignedData, Verifier } from '@road-labs/ocmf';
import { Crypto } from '@road-labs/ocmf-crypto-noble';

const crypto = new Crypto();
const verifier = new Verifier(crypto);

const verifyButton = document.getElementById('verify') as HTMLButtonElement;
const signedDataTextArea = document.getElementById(
  'signed-data'
) as HTMLTextAreaElement;
const publicKeyTextArea = document.getElementById(
  'public-key'
) as HTMLTextAreaElement;
const verificationDiv = document.getElementById(
  'verification'
) as HTMLDivElement;
const parsedDataDiv = document.getElementById('parsed-data') as HTMLDivElement;

verifyButton?.addEventListener('click', async () => {
  const signedData = signedDataTextArea?.value?.trim() || '';
  const publicKeyData = publicKeyTextArea?.value?.replace(/ /g, '') || '';

  try {
    const result = await verify(signedData, publicKeyData);
    if (result.verified && result.value) {
      displaySuccess(result.value);
    } else {
      displayError('Invalid signature or public key');
    }
  } catch (error) {
    displayError(error?.toString());
  }
});

const verify = async (
  signedData: string,
  publicKeyData: string
): Promise<ParseAndVerifyResult> => {
  if (signedData.length === 0) {
    throw new Error('Signed data is empty');
  }

  if (publicKeyData.length === 0) {
    throw new Error('Public key is empty');
  }

  const publicKey = await crypto.decodeEcPublicKey(
    hexToBytes(publicKeyData),
    'spki-der'
  );

  return await verifier.parseAndVerify(signedData, publicKey);
};

const displayError = (error: string | undefined) => {
  verificationDiv.innerText = `❌ ${error}`;
  parsedDataDiv.innerText = '';
};

const displaySuccess = (value: SignedData) => {
  verificationDiv.innerText = '✅ Verified';
  parsedDataDiv.innerText = JSON.stringify(value, null, 2);
};

const hexToBytes = (hex: string): Uint8Array => {
  if (
    hex.length === 0 ||
    hex.length % 2 !== 0 ||
    !hex.match(/^[A-Za-f0-9]+$/)
  ) {
    throw new Error('Invalid hex string');
  }
  const bytes = hex.match(/.{2}/g)?.map((byte) => parseInt(byte, 16));
  if (!bytes) {
    throw new Error('Failed to map hex string');
  }
  return new Uint8Array(bytes);
};
