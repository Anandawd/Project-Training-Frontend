import CCheckbox from "@/components/checkbox/checkbox.vue";
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

interface DepartmentAdjustment {
  code: string;
  name: string;
  staff_multiplier: number;
  additional_shifts: string[];
  overtime_allowance: number;
  special_rates: { [key: string]: number };
}

interface ShiftAdjustment {
  code: string;
  name: string;
  extended_hours: number;
  additional_staff: number;
  special_rate_multiplier: number;
}

interface SeasonalAdjustment {
  id?: number;
  placement_code: string;
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  department_adjustments: DepartmentAdjustment[];
  shift_adjustments: ShiftAdjustment[];
  staff_multiplier: number;
  is_active: boolean | string;
  remark: string;
  updated_at: string;
  updated_by: string;
  created_at: string;
  created_by: string;
}

@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
    CCheckbox,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    typeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    shiftOptions: {
      type: Array,
      default: (): any[] => [],
    },
    departmentOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  typeOptions!: any[];
  shiftOptions!: any[];
  departmentOptions!: any[];

  public form: SeasonalAdjustment = reactive({
    id: null,
    placement_code: "",
    code: "",
    name: "",
    start_date: "",
    end_date: "",
    department_adjustments: [],
    shift_adjustments: [],
    staff_multiplier: 0,
    is_active: true,
    remark: "",
    updated_at: "",
    updated_by: "",
    created_at: "",
    created_by: "",
  });

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

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      id: null,
      placement_code: "",
      code: "",
      name: "",
      start_date: "",
      end_date: "",
      department_adjustments: [],
      shift_adjustments: [],
      staff_multiplier: 0,
      is_active: "1",
      remark: "",
      created_at: new Date().toISOString().split("T")[0],
      created_by: "",
      updated_at: new Date().toISOString().split("T")[0],
      updated_by: "",
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  checkForm() {
    console.log(this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onShiftChange(adjustment: ShiftAdjustment) {
    const shift = this.shiftOptions.find((s) => s.code === adjustment.code);
    if (shift) {
      adjustment.name = shift.name;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({});
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }

  get totalAffectedDepartments(): number {
    return this.form.department_adjustments.length;
  }

  get totalAffectedShifts(): number {
    return this.form.shift_adjustments.length;
  }

  get estimatedStaffIncrease(): string {
    const multiplier = this.form.staff_multiplier;
    if (multiplier > 1) {
      return `+${((multiplier - 1) * 100).toFixed(0)}%`;
    } else if (multiplier < 1) {
      return `-${((1 - multiplier) * 100).toFixed(0)}%`;
    }
    return "No change";
  }
}
