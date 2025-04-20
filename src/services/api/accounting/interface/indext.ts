export type IInsertIncomeBudget = {
  user_id: string;
  password: string;
  mode_editor: number;
  ref_number: string;
  date: string;
  discount: number;
  bank_administration: number;
  discount_journal_account_code: number;
  ba_journal_account_code: string;
  other_expense: Number;
  oe_journal_account_code: string;
  journal_account_code: string;
  remark: string;
  payment_detail: [
    {
      id: number;
      folio_number: number;
      audit_date: string;
      amount: number;
      journal_account_code: string;
    }
  ];
};
export type IApRefund = {
  PurposeOfCode: string;
  MarketingCode: string;
  VoucherNumberTa: string;
  FlightNumber: string;
  FlightArrival: string;
  FlightDeparture: string;
  Notes: string;
  ShowNotes: boolean;
  HkNote: string;
  DocumentNumber: string;
  CreatedBy: string;
  UpdatedBy: string;
  Id: number;
};

export type IInsertAPRefundDeposit = {
  user_id: string;
  password: string;
  mode_editor: number;
  ref_number: string;
  date: string;
  discount: number;
  bank_administration: number;
  discount_journal_account_code: number;
  ba_journal_account_code: string;
  other_expense: Number;
  oe_journal_account_code: string;
  journal_account_code: string;
  remark: string;
  payment_detail: [
    {
      id: number;
      folio_number: number;
      audit_date: string;
      amount: number;
      journal_account_code: string;
    }
  ];
};

export type IInsertAPComission = {
  user_id: string;
  password: string;
  mode_editor: number;
  ref_number: string;
  date: string;
  discount: number;
  bank_administration: number;
  discount_journal_account_code: number;
  ba_journal_account_code: string;
  other_expense: Number;
  oe_journal_account_code: string;
  journal_account_code: string;
  remark: string;
  payment_detail: [
    {
      id: number;
      folio_number: number;
      audit_date: string;
      amount: number;
      journal_account_code: string;
    }
  ];
};
