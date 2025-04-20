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

  public defaultForm: any = {};
  public form: any = reactive({});
  public formDetail: any = reactive({});

  // form settings
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  statusOptions: any = [
    {
      SubGroupName: "Status",
      code: "A",
      name: "Active",
    },
    {
      SubGroupName: "Status",
      code: "I",
      name: "Inactive",
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
  supervisorOptions: any = [
    {
      SubGroupName: "Supervisor",
      code: "SPV01",
      name: "Budi Santoso",
    },
    {
      SubGroupName: "Supervisor",
      code: "SPV02",
      name: "Sari Dewi",
    },
  ];
  positionLevelOptions: any = [
    {
      SubGroupName: "Level",
      code: "LV1",
      name: "1",
    },
    {
      SubGroupName: "Level",
      code: "LV2",
      name: "2",
    },
    {
      SubGroupName: "Level",
      code: "LV3",
      name: "3",
    },
    {
      SubGroupName: "Level",
      code: "LV4",
      name: "4",
    },
    {
      SubGroupName: "Level",
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

  // actions
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      // reset data
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
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }
}
