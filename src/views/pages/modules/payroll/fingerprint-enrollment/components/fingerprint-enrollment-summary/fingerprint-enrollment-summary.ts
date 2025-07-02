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
    total_employees: 0,
    total_enrolled: 0,
    total_not_enrolled: 0,
    total_pending: 0,
    total_failed: 0,
  });

  // FORMAT FUNCTION
  formatCurrency = formatCurrency;
  formatNumberValue = formatNumberValue;
}
