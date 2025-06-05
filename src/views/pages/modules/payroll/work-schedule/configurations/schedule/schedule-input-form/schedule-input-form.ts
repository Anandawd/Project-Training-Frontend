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

interface ScheduleTemplateDetail {
  day_order: number;
  shift_code: string;
  shift_name: string;
  is_working_day: boolean;
  working_hours: number;
  remark?: string;
}

interface ScheduleTemplate {
  id?: number;
  code: string;
  name: string;
  description: string;
  type: "ROTATION" | "FIXED" | "FLEXIBLE" | "SEASONAL";
  rotation_pattern?: any;
  rotation_cycle_days?: number;
  is_default: boolean | string;
  is_active: boolean | string;
  details: ScheduleTemplateDetail[];
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

  public form: ScheduleTemplate = reactive({
    id: null,
    code: "",
    name: "",
    description: "",
    type: "ROTATION",
    rotation_cycle_days: 0,
    is_default: true,
    is_active: true,
    details: [],
    created_at: "",
    created_by: "",
    updated_at: "",
    updated_by: "",
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
      code: "",
      name: "",
      description: "",
      type: "ROTATION",
      rotation_cycle_days: 7,
      is_default: "1",
      is_active: "1",
      details: this.getDefaultScheduleDetails(),
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

  onCycleDaysChange() {
    const currentDetails = this.form.details.length;
    const newCycle = this.form.rotation_cycle_days || 7;

    if (newCycle > currentDetails) {
      for (let i = currentDetails + 1; i <= newCycle; i++) {
        this.form.details.push({
          day_order: i,
          shift_code: "OFF",
          shift_name: "Day OFF",
          is_working_day: false,
          working_hours: 0,
        });
      }
    } else if (newCycle < currentDetails) {
      this.form.details = this.form.details.slice(0, newCycle);
    }
  }

  onShiftChange(detail: ScheduleTemplateDetail) {
    const shift = this.shiftOptions.find((s) => s.code === detail.shift_code);
    if (shift) {
      detail.shift_name = shift.name;
      detail.is_working_day = detail.shift_code !== "OFF";
      detail.working_hours = detail.shift_code === "OFF" ? 0 : 8;
    }
  }

  getDefaultScheduleDetails(): ScheduleTemplateDetail[] {
    const details: ScheduleTemplateDetail[] = [];
    for (let i = 1; i <= 7; i++) {
      details.push({
        day_order: i,
        shift_code: "OFF",
        shift_name: "Day Off",
        is_working_day: false,
        working_hours: 0,
      });
    }
    return details;
  }

  getDayName(dayOrder: number): string {
    return this.dayNames[(dayOrder - 1) % 7];
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

  get dayNames(): string[] {
    return [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
  }

  get totalWorkingDays(): number {
    return this.form.details.filter((d: any) => d.is_working_day).length;
  }

  get totalWorkingHours(): number {
    return this.form.details.reduce(
      (sum: any, d: any) => sum + d.working_hours,
      0
    );
  }
}
