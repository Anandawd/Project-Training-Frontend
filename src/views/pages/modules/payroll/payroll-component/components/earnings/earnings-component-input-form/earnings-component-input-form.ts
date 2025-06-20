import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
    // placementOptions: {
    //   type: Array,
    //   default: (): any[] => [],
    // },
    earningsCategoryOptions: {
      type: Array,
      default: (): any[] => [],
    },
    unitOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  // placementOptions!: any[];
  earningsCategoryOptions!: any[];
  unitOptions!: any[];

  inputFormValidation: any = ref();
  modeData: any;
  isSaving: any;

  public form: any = reactive({});

  columnUnitOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    // {
    //   field: "code",
    //   label: "code",
    //   align: "right",
    //   width: "100",
    // },
  ];
  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
      filter: true,
    },
    {
      field: "code",
      label: "code",
      align: "right",
      width: "100",
    },
  ];

  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: "",
      code: "",
      name: "",
      description: "",
      category_code: "",
      type: "Earnings",
      // placement_code: "",
      default_amount: 0,
      default_quantity: 1,
      unit: "",
      formula: "",
      is_fixed: "0",
      is_taxable: "1",
      is_included_in_bpjs_health: "1",
      is_included_in_bpjs_employee: "1",
      is_prorated: "1",
      is_show_in_payslip: "1",
      active: "1",
      updated_at: "",
      updated_by: "",
      created_at: "",
      created_by: "",
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
    // this.onSave();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // validation
  get schema() {
    return Yup.object().shape({
      Code: Yup.string().required(),
      Name: Yup.string().required(),
      Category: Yup.string().required(),
      Qty: Yup.number().required().min(1),
      // Taxable: Yup.string().required(),
      // IncludedBpjsEmplyoee: Yup.string().required(),
      // IncludedBpjsHealth: Yup.string().required(),
      // IncludedProrate: Yup.string().required(),
      // ShowInPayslip: Yup.string().required(),
      // Status: Yup.string().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.table.payroll.payroll.earningsComponent"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.payroll.earningsComponent"
      )}`;
    }
  }

  get filteredUnitOptions() {
    const data = this.unitOptions.filter(
      (unit: any) => unit.code !== "Percentage"
    );

    return data;
  }
}
