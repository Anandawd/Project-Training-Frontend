export type IIsFolioAutoTransferAccount = {
  FolioNumber: number;
  AccountCode: string;
};

export type IGetAccount = {
  ModeEditor: number;
  CurrencyCode: string;
  SubDepartmentCode: string;
};

export type IGetTransactions = {
  Index: number;
  IsSearchLast: number;
  ShowVoid: number;
  ShowCorrection: number;
  PossessionOnly: number;
  ShowTransferred: number;
  DataPosition: number;
  DataLimit: number;
  FolioNumber: number;
  Text: string;
  SubFolioGroupCode: string;
};

export type IInsertTransactions = {
  FolioReservationNumber: number;
  RoomNumber: string;
  SubFolioGroupCode: string;
  Amount: number;
  DirectBillCode: string;
  ModeEditor: number;
  AutomaticTransfer: number;
  PostingBreakdown: number;
  ReservationStatusCode: string;
  DocumentNumber: string;
  AccountCode: string;
  SubDepartmentCode: string;
  CurrencyCode: string;
  Remark: string;
  CompanyCode: string;
  ChargeAmount: number;
  CardBankCode: string;
  CardTypeCode: string;
  CardHolder: string;
  CardNumber: string;
  IsDeposit: boolean;
  ValidMonth: string;
  ValidYear: string;
};

export type IInsertTransactionPackage = {
  FolioReservationNumber: number;
  RoomNumber: string;
  SubFolioGroupCode: string;
  BusinessSourceCode: string;
  CommissionTypeCode: string;
  CommissionValue: number;
  AccountCode: string;
  PackageCode: string;
  Child: number;
  Quantity: number;
  IsUtility: boolean;
  Adult: number;
  StartMeter: number;
  EndMeter: number;
};

export type IInsertTransactionPaymentCard = {
  FolioReservationNumber: number;
  RoomNumber: string;
  SubFolioGroupCode: string;
  Amount: number;
  ModeEditor: number;
  AutomaticTransfer: number;
  PostingBreakdown: number;
  ReservationStatusCode: string;
  DocumentNumber: string;
  AccountCode: string;
  SubDepartmentCode: string;
  CurrencyCode: string;
  Remark: string;
  ChargeAmount: number;
  CardBankCode: string;
  CardTypeCode: string;
  CardHolder: string;
  CardNumber: string;
  IsDeposit: boolean;
  ValidMonth: string;
  ValidYear: string;
};

export type IGetPackageByBusinessSourceCommission = {
  PackageCode: string;
  CompanyCode: string;
};

export type ICombineTransactionToSubFolio = {
  FolioNumber: number;
  SubFolioGroupCode: string;
};

export type ITransferTransaction = {
  SubFolioGroupCode: string;
  TransferAll: boolean;
  CorrectionBreakdown: number[];
  FolioNumber: number;
  FolioNumberTo: number;
};

export type ITransferBalance = {
  SubFolioGroupCode: string;
  IsCharge: boolean;
  Amount: number;
  RoomNumber: string;
  FolioNumber: number;
  FolioNumberTo: number;
};

export type IRoutingTransfer = {
  folio_number: number;
  transfer_existing: boolean;
  routing_account_list: [
    {
      folio_number: number;
      account_code: string;
      sub_folio_group_code: string;
    }
  ];
};

export type IReturnTransfer = {
  folio_number: string;
  return_all: boolean;
  return_type: number;
  sub_folio_group_code: string;
  folio_number_list: number[];
};
