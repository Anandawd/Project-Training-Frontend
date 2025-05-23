import { formatDateTimeUTC } from "@/utils/format";
import { IPayrollComponent } from "./interfaces";

export const payrollComponents: IPayrollComponent[] = [
  {
    id: 1,
    placement_code: "PL001",
    category_code: "ALLOW_FIXED",
    name: "Tunjangan Transportasi",
    code: "CE001",
    description: "Tunjangan transportasi bulanan untuk karyawan",
    default_amount: 200000,
    default_quantity: 1,
    unit: "Per Bulan",
    type: "EARNINGS",
    is_taxable: true,
    is_fixed: false,
    is_prorated: true,
    is_included_in_bpjs_health: false,
    is_included_in_bpjs_employee: false,
    is_show_in_payslip: true,
    active: true,
    calculation_method: "STANDARD",
    formula: "",
    entity_type: "earnings",
    created_at: formatDateTimeUTC(new Date(2020, 0, 1)),
    created_by: "Admin System",
    updated_at: formatDateTimeUTC(new Date(2020, 0, 1)),
    updated_by: "Admin System",
  },
];
