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
    CRadio,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  public isSave: boolean = false;
  public activeTab: string = "category";

  public form: any = reactive({});

  departmentOptions: any = [
    {
      code: "D01",
      name: "Marketing",
    },
    {
      code: "D02",
      name: "Human Resource",
    },
    {
      code: "D03",
      name: "Operational",
    },
    {
      code: "D04",
      name: "IT",
    },
  ];

  placementOptions: any = [
    {
      code: "PR01",
      name: "Amora Ubud",
    },
    {
      code: "PR02",
      name: "Amora Canggu",
    },
  ];

  supervisorOptions: any = [
    {
      code: "SPV01",
      name: "Budi Santoso",
    },
    {
      code: "SPV02",
      name: "Sari Dewi",
    },
  ];

  managerOptions: any = [
    {
      code: "MG01",
      name: "Budi Darmawan",
    },
    {
      code: "MG02",
      name: "Dewi Rahayu",
    },
  ];

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
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
      // Category tab
      departmentCode: "",
      departmentName: "",
      departmentDescription: "",
      departmentPlacement: "",
      departmentManager: "",
      departmentSupervisor: "",
      departmentStatus: "A",
      entityType: "category",
      id: undefined,
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    // this.inputFormValidation.$el.requestSubmit();
    this.onSave();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit({ errors }: any) {
    focusOnInvalid();
    // getToastError("onInvalidSubmit Please complete all required fields");
  }

  // validation
  get schema() {
    return Yup.object().shape({});
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.table.payroll.employee.insertDepartment"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.employee.updateDepartment"
      )}`;
    }
  }
}
