import { SignatureMethodId } from './signature';

export interface SignedData {
  header: Header;
  payloadData: PayloadData;
  signature: Signature;
}

export type Header = 'OCMF';
export const Header: Header = 'OCMF';

export interface PayloadData {
  FV?: string;
  GI?: string;
  GS?: string;
  GV?: string;
  PG: string;
  MV?: string;
  MM?: string;
  MS: string;
  MF?: string;
  IS: boolean;
  IL?: string;
  IF?: string[];
  IT: string;
  ID?: string;
  TT?: string;
  CF?: string;
  LC?: {
    LN?: string;
    LI?: number;
    LR: number;
    LU: string;
  };
  CT?: string;
  CI?: string;
  RD: {
    TM: string;
    TX?: 'B' | 'C' | 'X' | 'E' | 'L' | 'R' | 'A' | 'P' | 'S' | 'T';
    RV: number;
    RI?: string;
    RU: string;
    RT?: string;
    CL?: number;
    EF?: string;
    ST: string;
  }[];
}

export interface Signature {
  SA: SignatureMethodId;
  SE?: 'hex';
  SM?: 'application/x-der';
  SD: string;
}
