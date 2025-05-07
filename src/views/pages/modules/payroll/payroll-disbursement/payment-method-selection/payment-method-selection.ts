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
  emits: ["back", "continue", "method-selected"],
})
export default class PaymentMethodSelection extends Vue {
  public selectedMethod: string = "";

  selectMethod(method: string) {
    this.$emit("method-selected", method);
  }

  handleContinue() {
    if (this.selectedMethod) {
      this.$emit("continue");
    }
  }
}
