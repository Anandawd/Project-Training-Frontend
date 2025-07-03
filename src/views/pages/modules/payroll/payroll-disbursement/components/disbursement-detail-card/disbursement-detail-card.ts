import { formatCurrency } from "@/utils/format";
import "ag-grid-enterprise";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    periodData: {
      type: Object,
      default: (): any => ({}),
    },
  },
})
export default class DisbursementDetail extends Vue {
  public periodData!: any;

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Draft":
        return "text-bg-secondary";
      case "Pending":
        return "text-bg-warning";
      case "Approve":
        return "text-bg-success";
      case "Ready to Payment":
        return "text-bg-info";
      case "Completed":
        return "text-bg-primary";
      case "Rejected":
        return "text-bg-danger";
      default:
        return "text-bg-secondary";
    }
  }

  formatCurrency(value: any) {
    return formatCurrency(value);
  }
}
