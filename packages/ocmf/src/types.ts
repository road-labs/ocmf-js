import { SignatureMethodId } from './signature';

export interface SignedData {
  header: Header;
  payloadData: PayloadData;
  signature: Signature;
}

export type Header = 'OCMF';
export const Header: Header = 'OCMF';

type Iso15118UserAssignment = 'ISO15118_NONE' | 'ISO15118_PNC';
type PlmnUserAssignment = 'PLMN_NONE' | 'PLMN_RING' | 'PLMN_SMS';
type ChargingPointAssignment = 'EVSEID' | 'CBIDC';

type RfidUserAssignment =
  | 'RFID_NONE'
  | 'RFID_PLAIN'
  | 'RFID_RELATED'
  | 'RFID_PSK';

type OcppUserAssignment =
  | 'OCPP_NONE'
  | 'OCPP_RS'
  | 'OCPP_AUTH'
  | 'OCPP_RS_TLS'
  | 'OCPP_AUTH_TLS'
  | 'OCPP_CACHE'
  | 'OCPP_WHITELIST'
  | 'OCPP_CERTIFIED';

type IdentificationLevel =
  | 'NONE'
  | 'HEARSAY'
  | 'TRUSTED'
  | 'VERIFIED'
  | 'CERTIFIED'
  | 'SECURE'
  | 'MISMATCH'
  | 'INVALID'
  | 'OUTDATED'
  | 'UNKNOWN';

type IdentificationType =
  | 'NONE'
  | 'DENIED'
  | 'UNDEFINED'
  | 'ISO14443'
  | 'ISO15693'
  | 'EMAID'
  | 'EVCCID'
  | 'EVCOID'
  | 'ISO7812'
  | 'CARD_TXN_NR'
  | 'CENTRAL'
  | 'CENTRAL_1'
  | 'CENTRAL_2'
  | 'LOCAL'
  | 'LOCAL_1'
  | 'LOCAL_2'
  | 'PHONE_NUMBER'
  | 'KEY_CODE';

type MeterReadingReason =
  | 'B' // Begin of transaction
  | 'C' // Charging
  | 'X' // Exception
  | 'E' // End of transaction
  | 'L' // End of transaction, terminated locally
  | 'R' // End of transaction, terminated remotely
  | 'A' // End of transaction, due to abort
  | 'P' // End of transaction, due to power failure
  | 'S' // Suspended
  | 'T'; // Tariff change

type MeterStatus =
  | 'N' // NOT_PRESENT
  | 'G' // OK
  | 'T' // TIMEOUT
  | 'D' // DISCONNECTED
  | 'R' // NOT_FOUND
  | 'M' // MANIPULATED
  | 'X' // EXCHANGED
  | 'I' // INCOMPATIBLE
  | 'O' // OUT_OF_RANGE
  | 'S' // SUBSTITUTE
  | 'E' // OTHER_ERROR
  | 'F'; // READ_ERROR

// This should be more restrictive if we can find a way
type UserAssignment =
  | RfidUserAssignment
  | OcppUserAssignment
  | Iso15118UserAssignment
  | PlmnUserAssignment;

type UnitType = 'kWh' | 'Wh' | 'mOhm' | 'uOhm';

export interface PayloadData {
  FV?: string; // Format Version
  GI?: string; // Gateway Identification
  GS?: string; // Gateway Serial
  GV?: string; // Gateway Version
  PG: string; // Pagination
  MV?: string; // Meter Vendor
  MM?: string; // Meter Model
  MS: string; // Meter Serial
  MF?: string; // Meter Firmware
  IS: boolean; // Identification Status
  IL?: IdentificationLevel; // Identification Level
  IF?: UserAssignment[]; // Identification Flags
  IT: IdentificationType; // Identification Type
  ID?: string; // Identification Data
  TT?: string; // Tariff Text
  CF?: string; // Charge Controller Firmware Version
  LC?: {
    // Loss Compensation
    LN?: string; // Naming
    LI?: number; // Identification
    LR: number; // Cable Resistance
    LU: Extract<UnitType, 'mOhm' | 'uOhm'>; // Resistance Unit
  };
  CT?: ChargingPointAssignment; // Charge Point Identification Type
  CI?: string; // Charge Point Identification
  RD: {
    // Readings
    TM: string; // Time
    TX?: MeterReadingReason; // Transaction
    RV: number; // Reading Value
    RI?: string; // Reading Identification
    RU: UnitType; // Reading Unit
    RT?: string; // Reading Current Type
    CL?: number; // Cumulated Loss
    EF?: string; // Error Flag
    ST: MeterStatus; // Status
  }[];
}

export interface Signature {
  SA?: SignatureMethodId;
  SE?: 'hex';
  SM?: 'application/x-der';
  SD: string;
}
