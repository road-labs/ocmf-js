import { Header, SignedData } from './types';

interface Sections {
  header: Header;
  payloadData: string;
  signature: string;
}

export function decomposeValue(value: string): Sections {
  const parts = value.split('|');
  if (parts.length !== 3) {
    throw new Error('Signed data must be in OCMF|data|signature format');
  }

  const headerSection = parts[0];
  const payloadDataSection = parts[1];
  const signatureSection = parts[2];

  if (headerSection !== 'OCMF') {
    throw new Error('OCMF header required');
  }
  if (payloadDataSection.length === 0) {
    throw new Error('Payload section cannot be empty');
  }
  if (signatureSection.length === 0) {
    throw new Error('Signature section cannot be empty');
  }

  return {
    header: headerSection,
    payloadData: payloadDataSection,
    signature: signatureSection,
  };
}

export function parseSections(sections: Sections): SignedData {
  return {
    header: sections.header,
    payloadData: JSON.parse(sections.payloadData),
    signature: JSON.parse(sections.signature),
  };
}
