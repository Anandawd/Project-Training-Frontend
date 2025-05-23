import { IOptions } from "./interfaces";

export const options: IOptions = {
  employeeTypes: [
    { code: "PERMANENT", name: "Permanent", SubGroupName: "Employee Type" },
    { code: "CONTRACT", name: "Contract", SubGroupName: "Employee Type" },
    { code: "PART_TIME", name: "Part-time", SubGroupName: "Employee Type" },
    { code: "SEASONAL", name: "Seasonal", SubGroupName: "Employee Type" },
    { code: "CASUAL", name: "Casual", SubGroupName: "Employee Type" },
    { code: "INTERN", name: "Intern", SubGroupName: "Employee Type" },
    { code: "FREELANCER", name: "Freelancer", SubGroupName: "Employee Type" },
    { code: "CONTRACTOR", name: "Contractor", SubGroupName: "Employee Type" },
    { code: "CONSULTANT", name: "Consultant", SubGroupName: "Employee Type" },
    { code: "VENDOR", name: "Vendor", SubGroupName: "Employee Type" },
    { code: "RESIGNED", name: "Resigned", SubGroupName: "Employee Type" },
    { code: "RETIRED", name: "Retired", SubGroupName: "Employee Type" },
    { code: "TERMINATED", name: "Terminated", SubGroupName: "Employee Type" },
  ],

  genders: [
    { code: "M", name: "Male", SubGroupName: "Gender" },
    { code: "F", name: "Female", SubGroupName: "Gender" },
  ],

  paymentFrequencies: [
    { code: "DAILY", name: "Daily", SubGroupName: "Payment Frequency" },
    { code: "WEEKLY", name: "Weekly", SubGroupName: "Payment Frequency" },
    { code: "BIWEEKLY", name: "Bi-Weekly", SubGroupName: "Payment Frequency" },
    { code: "MONTHLY", name: "Monthly", SubGroupName: "Payment Frequency" },
  ],

  maritalStatuses: [
    {
      code: "TK0",
      name: "TK0 - Single, no dependent",
      SubGroupName: "Marital Status",
    },
    {
      code: "TK1",
      name: "TK1 - Single, 1 dependent",
      SubGroupName: "Marital Status",
    },
    {
      code: "TK2",
      name: "TK2 - Single, 2 dependents",
      SubGroupName: "Marital Status",
    },
    {
      code: "TK3",
      name: "TK3 - Single, 3 dependents",
      SubGroupName: "Marital Status",
    },
    {
      code: "K0",
      name: "K0 - Married, no dependent",
      SubGroupName: "Marital Status",
    },
    {
      code: "K1",
      name: "K1 - Married, 1 dependent",
      SubGroupName: "Marital Status",
    },
    {
      code: "K2",
      name: "K2 - Married, 2 dependents",
      SubGroupName: "Marital Status",
    },
    {
      code: "K3",
      name: "K3 - Married, 3 dependents",
      SubGroupName: "Marital Status",
    },
    {
      code: "KI0",
      name: "KI0 - Married (combined income), no dependent",
      SubGroupName: "Marital Status",
    },
    {
      code: "KI1",
      name: "KI1 - Married (combined income), 1 dependent",
      SubGroupName: "Marital Status",
    },
    {
      code: "KI2",
      name: "KI2 - Married (combined income), 2 dependents",
      SubGroupName: "Marital Status",
    },
    {
      code: "KI3",
      name: "KI3 - Married (combined income), 3 dependents",
      SubGroupName: "Marital Status",
    },
  ],

  paymentMethods: [
    { code: "CASH", name: "Cash", SubGroupName: "Payment Method" },
    { code: "TRANSFER", name: "Bank Transfer", SubGroupName: "Payment Method" },
    {
      code: "EWALLET",
      name: "E-wallet Transfer",
      SubGroupName: "Payment Method",
    },
    {
      code: "VIRTUAL",
      name: "Virtual Account",
      SubGroupName: "Payment Method",
    },
  ],

  banks: [
    { code: "002", name: "Bank Rakyat Indonesia (BRI)", SubGroupName: "Bank" },
    { code: "008", name: "Bank Mandiri", SubGroupName: "Bank" },
    { code: "009", name: "Bank Negara Indonesia (BNI)", SubGroupName: "Bank" },
    { code: "011", name: "Bank Danamon", SubGroupName: "Bank" },
    { code: "013", name: "Bank Permata", SubGroupName: "Bank" },
    { code: "014", name: "Bank Central Asia (BCA)", SubGroupName: "Bank" },
    { code: "016", name: "Bank Maybank Indonesia", SubGroupName: "Bank" },
    { code: "022", name: "CIMB Niaga", SubGroupName: "Bank" },
    { code: "023", name: "Bank UOB Indonesia", SubGroupName: "Bank" },
    { code: "028", name: "Bank OCBC NISP", SubGroupName: "Bank" },
    { code: "200", name: "Bank Tabungan Negara (BTN)", SubGroupName: "Bank" },
    { code: "213", name: "Bank BTPN", SubGroupName: "Bank" },
    { code: "426", name: "Bank Mega", SubGroupName: "Bank" },
    { code: "441", name: "Bank Bukopin", SubGroupName: "Bank" },
    { code: "451", name: "Bank Syariah Indonesia (BSI)", SubGroupName: "Bank" },
  ],

  documentTypes: [
    { code: "KTP", name: "ID Card (KTP)", SubGroupName: "Document Type" },
    { code: "PASSPORT", name: "Passport", SubGroupName: "Document Type" },
    { code: "NPWP", name: "Tax ID (NPWP)", SubGroupName: "Document Type" },
    { code: "SIM", name: "Driver License", SubGroupName: "Document Type" },
    { code: "CV", name: "CV/Resume", SubGroupName: "Document Type" },
    {
      code: "IJAZAH",
      name: "Education Certificate",
      SubGroupName: "Document Type",
    },
    {
      code: "SERTIFIKAT",
      name: "Professional Certificate",
      SubGroupName: "Document Type",
    },
    {
      code: "KONTRAK",
      name: "Employment Contract",
      SubGroupName: "Document Type",
    },
    {
      code: "REKENING",
      name: "Bank Account Information",
      SubGroupName: "Document Type",
    },
    {
      code: "BPJS_KES",
      name: "Health Insurance Card",
      SubGroupName: "Document Type",
    },
    {
      code: "BPJS_TK",
      name: "Social Security Card",
      SubGroupName: "Document Type",
    },
    { code: "KK", name: "Family Card", SubGroupName: "Document Type" },
    {
      code: "AKTA_NIKAH",
      name: "Marriage Certificate",
      SubGroupName: "Document Type",
    },
    {
      code: "AKTA_LAHIR",
      name: "Birth Certificate",
      SubGroupName: "Document Type",
    },
    {
      code: "REF_LETTER",
      name: "Reference Letter",
      SubGroupName: "Document Type",
    },
  ],

  adjustmentReasons: [
    {
      code: "INITIAL",
      name: "Initial Salary",
      SubGroupName: "Adjustment Reason",
    },
    { code: "PROMOTION", name: "Promotion", SubGroupName: "Adjustment Reason" },
    {
      code: "ANNUAL_REVIEW",
      name: "Annual Review",
      SubGroupName: "Adjustment Reason",
    },
    {
      code: "PERFORMANCE",
      name: "Performance Based",
      SubGroupName: "Adjustment Reason",
    },
    {
      code: "MARKET_ADJUSTMENT",
      name: "Market Adjustment",
      SubGroupName: "Adjustment Reason",
    },
    {
      code: "STRUCTURAL",
      name: "Structural Change",
      SubGroupName: "Adjustment Reason",
    },
    {
      code: "CERTIFICATION",
      name: "Certification Achievement",
      SubGroupName: "Adjustment Reason",
    },
    { code: "DEMOTION", name: "Demotion", SubGroupName: "Adjustment Reason" },
    {
      code: "CORRECTION",
      name: "Correction",
      SubGroupName: "Adjustment Reason",
    },
    { code: "OTHER", name: "Other", SubGroupName: "Adjustment Reason" },
  ],

  componentTypes: [
    { code: "EARNINGS", name: "Earnings", SubGroupName: "Component Type" },
    { code: "DEDUCTIONS", name: "Deductions", SubGroupName: "Component Type" },
  ],
};
