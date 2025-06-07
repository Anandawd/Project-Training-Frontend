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
    placementOptions: {
      type: Array,
      default: (): any[] => [],
    },
    departmentOptions: {
      type: Array,
      default: (): any[] => [],
    },
    positionOptions: {
      type: Array,
      default: (): any[] => [],
    },
    categoryOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  placementOptions!: any[];
  departmentOptions!: any[];
  positionOptions!: any[];
  categoryOptions!: any[];

  public form = reactive({});

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
      category: "",
      start_time: "",
      end_time: "",
      break_duration: 60,
      working_hours: 8,
      overtime_multiplier: 0,
      split_times: [],
      departments: [],
      positions: [],
      color: "",
      is_split_shift: false,
      is_night_shift: "0",
      is_active: "1",
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

  onDepartmentsChange(department: any) {
    const dpt = this.departmentOptions.find((d) => d.code === department.code);
    if (dpt) {
      dpt.code = department.code;
      dpt.name = department.name;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({
      // SelectPlacement: Yup.string().required(),
      // Code: Yup.string().required(),
      // Name: Yup.string().required(),
      // Category: Yup.string().required(),
      // StartTime: Yup.string().required(),
      // EndTime: Yup.string().required(),
      // BreakDuration: Yup.number().required(),
      // WorkingHours: Yup.number().required(),
      // Color: Yup.string().required(),
    });
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
}
