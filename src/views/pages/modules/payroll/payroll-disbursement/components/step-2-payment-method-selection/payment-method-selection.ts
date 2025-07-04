import $global from "@/utils/global";
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

  // GENERAL FUNCTION
  handleAction(mode: any = null) {
    const actionMode = mode;
    switch (actionMode) {
      case $global.modePayroll.back:
        this.handleBack();
        break;
      case $global.modePayroll.next:
        this.handleContinue();
        break;
      default:
        console.warn("Unsupported action mode:", actionMode);
        break;
    }
  }

  selectMethod(method: string) {
    this.$emit("method-selected", method);
  }

  handleBack() {
    this.$emit("back");
  }

  handleContinue() {
    if (this.selectedMethod) {
      this.$emit("continue");
    }
  }
}
