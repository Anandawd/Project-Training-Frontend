import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { Options, Vue } from "vue-class-component";
// import DetailCellRender from "./detail-bank/detail-bank.vue";
import PayrollPeriodsAPI from "@/services/api/payroll/payroll-periods/payroll-periods";
import SummaryPaymentBankTable from "../../components/summary-payment-bank/summary-payment-bank.vue";
import DisbursementDetailCard from "../disbursement-detail-card/disbursement-detail-card.vue";

const payrollPeriodsAPI = new PayrollPeriodsAPI();

@Options({
  components: {
    AgGridVue,
    SummaryPaymentBankTable,
    DisbursementDetailCard,
  },
  props: {
    periodData: {
      type: Object,
      required: true,
      default: (): any => ({}),
    },
    rowSummaryBankData: {
      type: Array,
      required: true,
      default: (): any[] => [],
    },
  },
  emits: ["continue", "return"],
})
export default class DisbursementDetail extends Vue {
  // data
  public periodData: any = {};
  public rowSummaryBankData: any = [];

  // GENERAL FUNCTION =======================================================
  handleContinue() {
    this.$emit("continue");
  }

  handleBack() {
    this.$emit("return");
  }

  // COMPUTED PROPERTIES
  get canContinue(): boolean {
    return this.periodData.status === "Ready to Payment";
  }
}
