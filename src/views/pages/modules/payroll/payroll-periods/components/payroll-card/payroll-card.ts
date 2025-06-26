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
    payrollData: {
      type: Object,
      required: true,
      default: (): any => ({}),
    },
  },
  emits: ["update", "delete"],
})
export default class PayrollCard extends Vue {
  title!: string;
  footertitle!: string;
  type!: string;
  components: any = reactive([]);
  payrollData: any = reactive({});

  public editingIndex: number = null;
  public originalData: any = null;

  qty: number = 1;

  mounted(): void {
    console.log("Type:", this.type);
    console.log("Component:", this.components);
    console.log("Total Amount:", this.payrollData);
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

  get showBaseSalary() {
    return this.type === "Earnings";
  }
}
