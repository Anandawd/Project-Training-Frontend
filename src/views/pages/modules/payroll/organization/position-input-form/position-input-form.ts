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
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  public activeTab: string = "position";

  public form: any = reactive({});

  // form settings
  Options: any = [
    {
      SubGroupName: "Type",
      code: "T01",
      name: "Earnings",
    },
    {
      SubGroupName: "Type",
      code: "T02",
      name: "Deductions",
    },
  ];

  positionOptions: any = [
    {
      SubGroupName: "Position",
      code: "P01",
      name: "Owner",
    },
    {
      SubGroupName: "Position",
      code: "P02",
      name: "Director",
    },
    {
      SubGroupName: "Position",
      code: "P03",
      name: "Manager",
    },
    {
      SubGroupName: "Position",
      code: "P04",
      name: "Supervisor",
    },
    {
      SubGroupName: "Position",
      code: "P05",
      name: "Senior Staff",
    },
    {
      SubGroupName: "Position",
      code: "P06",
      name: "Staff",
    },
    {
      SubGroupName: "Position",
      code: "P07",
      name: "Assistant",
    },
    {
      SubGroupName: "Position",
      code: "P08",
      name: "Trainee",
    },
    {
      SubGroupName: "Position",
      code: "P09",
      name: "Intern",
    },
    {
      SubGroupName: "Position",
      code: "P10",
      name: "Part-timer",
    },
  ];

  departmentOptions: any = [
    {
      SubGroupName: "Department",
      code: "D01",
      name: "Marketing",
    },
    {
      SubGroupName: "Department",
      code: "D02",
      name: "Human Resource",
    },
    {
      SubGroupName: "Department",
      code: "D03",
      name: "Operational",
    },
    {
      SubGroupName: "Department",
      code: "D04",
      name: "IT",
    },
  ];

  placementOptions: any = [
    {
      SubGroupName: "Placement",
      code: "PR01",
      name: "Amora Ubud",
    },
    {
      SubGroupName: "Placement",
      code: "PR02",
      name: "Amora Canggu",
    },
  ];

  positionLevelOptions: any = [
    {
      code: "LV1",
      name: "1",
    },
    {
      code: "LV2",
      name: "2",
    },
    {
      code: "LV3",
      name: "3",
    },
    {
      code: "LV4",
      name: "4",
    },
    {
      code: "LV5",
      name: "5",
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
      positionCode: "",
      positionName: "",
      positionDescription: "",
      positionLevel: "",
      positionDepartment: "",
      positionPlacement: "",
      positionStatus: "A",
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
        "commons.table.payroll.employee.insertPosition"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.employee.updatePosition"
      )}`;
    }
  }
}
