import "ag-grid-enterprise";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "PaymentMethodSelection",
  props: {
    selectedMethod: {
      type: String,
      default: "",
    },
  },
  emits: ["continue", "method-selected", "back"],
})
export default class PaymentMethodSelection extends Vue {
  public selectedMethod: string = "";

  selectMethod(method: string) {
    this.selectedMethod = method;
    this.$emit("method-selected", method);
  }

  handleContinue() {
    if (this.selectedMethod) {
      this.$emit("continue");
    }
  }
}
