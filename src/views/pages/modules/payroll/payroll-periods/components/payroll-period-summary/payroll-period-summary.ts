import { formatCurrency, formatNumberValue } from "@/utils/format";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    AgGridVue,
  },
  props: {
    statusCounts: {
      type: Object,
      default: (): any => {},
    },
  },
})
export default class DeductionsTable extends Vue {
  statusCounts: any = ref({
    employee: 0,
    gross_salary: 0,
    total_deductions: 0,
    net_salary: 0,
  });

  // FORMAT FUNCTION
  formatCurrency = formatCurrency;
  formatNumberValue = formatNumberValue;
}
