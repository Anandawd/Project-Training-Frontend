import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { formatCurrency } from "@/utils/format";
import { Form as CForm } from "vee-validate";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "PayrollCard",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    employeePayroll: {
      type: Object,
      required: true,
      default: (): any => {},
    },
  },
})
export default class PayrollCard extends Vue {
  title!: string;
  employeePayroll: any = reactive({
    actual_workdays: 30,
    basic_salary: "10000000.00",
    employee_id: "EMP003",
    gross_salary: "11024000.00",
    gross_salary_taxable: "11024000.00",
    net_salary: "10393280.00",
    payment_date: "0001-01-01T00:00:00Z",
    payment_method: "Bank Transfer",
    payment_reference: "",
    payroll_id: "",
    period_code: "payroll-cakra-bali-juni",
    prorata_factor: "1.00",
    remark: "",
    status: "Draft",
    tax_amount: "330720.00",
    tax_income_type: "PPh21",
    tax_method: "Gross",
    total_deductions: "300000.00",
    total_deductions_taxable: "300000.00",
    total_workdays: 30,
  });

  formatCurrency(value: any) {
    return formatCurrency(value);
  }

  get grossSalary() {
    return formatCurrency(this.employeePayroll.gross_salary);
  }
}
