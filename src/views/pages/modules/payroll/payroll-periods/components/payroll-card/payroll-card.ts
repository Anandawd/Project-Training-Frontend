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
    footertitle: {
      type: String,
      required: true,
      default: (): string => "Total",
    },
    type: {
      type: String,
      required: true,
    },
    components: {
      type: Array,
      required: true,
      default: (): any[] => [],
    },
    statutoryData: {
      type: Array,
      required: true,
      default: (): any[] => [],
    },
    payrollData: {
      type: Object,
      required: true,
      default: (): any => ({}),
    },
  },
  emits: ["component-amount-change", "component-quantity-change"],
})
export default class PayrollCard extends Vue {
  title!: string;
  footertitle!: string;
  type!: string;
  components: any = reactive([]);
  statutoryData: any = reactive([]);
  payrollData: any = reactive({});

  public editingIndex: number = null;
  public originalData: any = null;

  qty: number = 1;

  handleComponentAmountChange(component: any) {
    this.$emit("component-amount-change", component);
  }

  handleComponentQuantityChange(component: any) {
    this.$emit("component-quantity-change", component);
  }

  formatCurrency(value: any) {
    return formatCurrency(value);
  }

  get totalAmount() {
    switch (this.type) {
      case "Earnings":
        return this.payrollData.gross_salary;
      case "Deductions":
        return this.payrollData.total_deductions;
    }
    return 0;
  }

  get showFooter() {
    return this.payrollData;
  }

  get showBaseSalary() {
    return this.type === "Earnings";
  }

  get showComponents() {
    return this.components && this.components.length > 0;
  }

  get showStatutory() {
    return this.statutoryData && this.statutoryData.length > 0;
  }

  get isEmpty() {
    return !this.showComponents && !this.showComponents;
  }

  get showContent() {
    return this.showComponents || this.showStatutory;
  }

  get isDraft() {
    return (
      this.payrollData.status === "Draft" || this.payrollData.status === "DRAFT"
    );
  }
}
