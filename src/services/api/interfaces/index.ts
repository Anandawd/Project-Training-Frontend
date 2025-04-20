export interface IGetDepositReservationList {
  ReservationNumber: number,
  SystemCode: string,
  Void: boolean,
  ShowCorrection: boolean
}

export interface IGetAvailableRoomByType {
  RoomTypeCode: string,
  BedTypeCode: string,
  ArrivalDate: string,
  DepartureDate: string,
  ReservationNumber: number,
  RoomUnavailableID: number,
  RoomAllotmentID: number,
  ReadyOnly: boolean,
  AllotmentOnly: boolean
}

export interface IGetRoomRate {
  RoomTypeCode: string,
  BusinessSourceCode: string,
  MarketCode: string,
  CompanyCode: string,
  ArrivalDate: string,
}

export interface IGetRoomRateAmount {
  RoomRateCode: string,
  PostingDateStr: string,
  Adult: number,
  Child: number
}

export interface IGuestProfileData {
  TitleCode: string,
  FullName: string,
  Street: string,
  CountryCode: string,
  StateCode: string,
  CityCode: string,
  City: string,
  NationalityCode: string,
  PostalCode: string,
  Phone1: string,
  Phone2: string,
  Fax: string,
  Email: string,
  Website: string,
  CompanyCode: string,
  GuestTypeCode: string,
  IdCardCode: string,
  IdCardNumber: string,
  IsMale: boolean,
  BirthPlace: string,
  BirthDate: string,
  TypeCode: string,
  CustomField01: string,
  CustomField02: string,
  CustomField03: string,
  CustomField04: string,
  CustomField05: string,
  CustomField06: string,
  CustomField07: string,
  CustomField08: string,
  CustomField09: string,
  CustomField10: string,
  CustomField11: string,
  CustomField12: string,
  CustomLookupFieldCode01: string,
  CustomLookupFieldCode02: string,
  CustomLookupFieldCode03: string,
  CustomLookupFieldCode04: string,
  CustomLookupFieldCode05: string,
  CustomLookupFieldCode06: string,
  CustomLookupFieldCode07: string,
  CustomLookupFieldCode08: string,
  CustomLookupFieldCode09: string,
  CustomLookupFieldCode10: string,
  CustomLookupFieldCode11: string,
  CustomLookupFieldCode12: string,
  IsActive: boolean,
  IsBlacklist: boolean,
  CustomerCode: string,
  Source: string,
  CreatedBy: string,
  UpdatedBy: string,
  Id: number
}

export interface IGuestDetailData {
  Arrival: string,
  ArrivalUnixx: number,
  ArrivalRes: string,
  Departure: string,
  DepartureUnixx: number,
  DepartureRes: string,
  Adult: number,
  Child: number,
  RoomTypeCode: string,
  BedTypeCode: string,
  RoomNumber: number,
  CurrencyCode: string,
  ExchangeRate: number,
  IsConstantCurrency: boolean,
  RoomRateCode: string,
  IsOverrideRate: boolean,
  WeekdayRate: number,
  WeekendRate: number,
  DiscountPercent: boolean,
  Discount: number,
  BusinessSourceCode: string,
  IsOverrideCommission: boolean,
  CommissionTypeCode: string,
  CommissionValue: number,
  PaymentTypeCode: string,
  MarketCode: string,
  BookingSourceCode: string,
  BillInstruction: string,
  CreatedBy: string,
  UpdatedBy: string,
  Id: number
}

export interface IGuestGeneralData {
  PurposeOfCode: string,
  MarketingCode: string,
  VoucherNumberTa: string,
  FlightNumber: string,
  FlightArrival: string,
  FlightDeparture: string,
  Notes: string,
  ShowNotes: boolean,
  HkNote: string,
  DocumentNumber: string,
  CreatedBy: string,
  UpdatedBy: string,
  Id: number
}

export interface IReservationData {
  Number: number,
  ContactPersonId1: number,
  ContactPersonId2: number,
  ContactPersonId3: number,
  ContactPersonId4: number,
  GuestDetailId: number,
  GuestProfileId1: number,
  GuestProfileId2: number,
  GuestProfileId3: number,
  GuestProfileId4: number,
  GuestGeneralId: number,
  ReservationBy: string,
  GroupCode: string,
  MemberCode: string,
  StatusCode: string,
  StatusCode2: string,
  IsIncognito: boolean,
  IsLock: boolean,
  IsFromAllotment: boolean,
  BookingCode: string,
  OtaId: string,
  CmResStatus: string,
  IsCmConfirmed: boolean,
  ChangeStatusAt: string,
  ChangeStatusBy: string,
  CancelledAt: string,
  CancelledBy: string,
  CancelReason: string,
  CreatedBy: string,
  UpdatedBy: string
}

export interface IFolioData {
  Number: number,
  TypeCode: string,
  CoNumber: string,
  ReservationNumber: number,
  ContactPersonId1: number,
  ContactPersonId2: number,
  ContactPersonId3: number,
  ContactPersonId4: number,
  GuestDetailId: number,
  GuestProfileId1: number,
  GuestProfileId2: number,
  GuestProfileId3: number,
  GuestProfileId4: number,
  GuestGeneralId: number,
  RoomStatusCode: string,
  StatusCode: string,
  VoucherNumber: string,
  ShowNotes: false,
  ComplimentHu: string,
  IsCtlApproved: false,
  IsLock: false,
  IsPrinted: false,
  IsFromAllotment: false,
  SystemCode: string,
  CheckOutAt: string,
  CheckOutBy: string,
  CancelledAt: string,
  CancelledBy: string,
  CancelReason: string,

}

export interface IFullReservationData {
  GuestProfileData1: IGuestProfileData,
  GuestProfileData2: IGuestProfileData,
  GuestProfileData3: IGuestProfileData,
  GuestProfileData4: IGuestProfileData,
  GuestDetailData: IGuestDetailData,
  GuestGeneralData: IGuestGeneralData,
  ReservationData: IReservationData
}

export interface IReservationList {
  SearchByIndex: number,
  SearchText: string,
  GroupCode: string,
  StatusCode: string,
  IsSearchLast: boolean,
  IsIndividual: boolean,
  DataPosition: number,
  DataLimit: number,
  StartDate: string,
  EndDate: string
}

export interface IInsertGuestDeposit {
  GuestDeposit: {
    ReservationNumber: number,
    SubDepartmentCode: string,
    AccountCode: string,
    Amount: number,
    DefaultCurrencyCode: string,
    AmountForeign: number,
    ExchangeRate: number,
    CurrencyCode: string,
    AuditDate: string,
    Remark: string,
    DocumentNumber: string,
    TypeCode: string,
    CardBankCode: string,
    CardTypeCode: string,
    RefNumber: number,
    Void: false,
    VoidDate: string,
    VoidBy: string,
    VoidReason: string,
    IsCorrection: false,
    CorrectionBy: string,
    CorrectionReason: string,
    CorrectionBreakdown: number,
    Shift: string,
    LogShiftId: number,
    IsPairWithFolio: false,
    TransferPairId: number,
    SystemCode: string,
    CreatedBy: string,
    UpdatedBy: string,
    Id: number,
  },
  IDCorrected: number,
  IsCard: boolean,
  ChargeAmount: number,
  CardNumber: string,
  CardHolder: string,
  ValidMonth: string,
  ValidYear: string,
}

export interface IVoidDeposit {
  GuestDepositId: number,
  VoidBy: string,
  VoidReason: string
}

export interface IVoidDepositByCorrectionId {
  CorrectionBreakdown: number,
  VoidBy: string,
  VoidReason: string
}

export interface IUpdateReservationStatus {
  ReservationNumber: number,
  StatusCode: string,
  CancelBy: string,
  CancelReason: string
}



export interface IFullGuestInHouseData {
  GuestProfileData1: IGuestProfileData,
  GuestProfileData2: IGuestProfileData,
  GuestProfileData3: IGuestProfileData,
  GuestProfileData4: IGuestProfileData,
  GuestDetailData: IGuestDetailData,
  GuestGeneralData: IGuestGeneralData,
  FolioData: IFolioData
}

export interface IMoveRoom {
  FolioNumber: number,
  RoomNumber: string,
  IsChangeRate: boolean,
  RoomRateCode: string,
  RoomTypeCode: string,
  BedTypeCode: string,
  RoomStatusCode: string,
}


export interface ISetComplimentHU {
  FolioNumber: Array<number>,
  ComplimentType: string,
}

// export type IInsertStoctTransfer = {
//   // number: string;
//   document_number: string;
//   request_by: string;
//   store_code: string;
//   to_store_code: string;
//   from_store_code: string;
//   date: string;
//   remark: string;
//   details: [
//     {
//       StNumber: string
//       quantity: number;
//       from_store_code: string;
//       uom_code: string;
//       item_code: string;
//       receive_id: number;
//     }
//   ];
// };
