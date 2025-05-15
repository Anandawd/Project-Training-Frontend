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
  modeData!: any;
  initialData!: any;
  public activeTab: string = "position";

  public form: any = reactive({
    positionCode: "",
    positionName: "",
    positionDescription: "",
    positionLevel: "",
    positionDepartment: "",
    positionPlacement: "",
    positionStatus: "A",
  });

  // form settings
  positionOptions: any = [
    { code: "P001", name: "Chief Executive Officer" },
    { code: "P002", name: "Chief Operating Officer" },
    { code: "P003", name: "Chief Financial Officer" },
    { code: "P004", name: "HR Director" },
    { code: "P005", name: "IT Director" },
    { code: "P006", name: "Marketing Director" },
    { code: "P007", name: "Operations Manager" },
    { code: "P008", name: "Front Office Manager" },
    { code: "P009", name: "Housekeeping Manager" },
    { code: "P010", name: "Executive Chef" },
    { code: "P011", name: "HR Manager" },
    { code: "P012", name: "IT Manager" },
    { code: "P013", name: "Accounting Manager" },
    { code: "P014", name: "Front Desk Supervisor" },
    { code: "P015", name: "Restaurant Manager" },
    { code: "P016", name: "HR Specialist" },
    { code: "P017", name: "IT Support Specialist" },
    { code: "P018", name: "Accountant" },
    { code: "P019", name: "Front Desk Agent" },
    { code: "P020", name: "Server" },
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
    { code: "PL001", name: "Amora Ubud" },
    { code: "PL002", name: "Amora Canggu" },
    { code: "PL003", name: "Amora Seminyak" },
    { code: "PL004", name: "Amora Nusa Dua" },
    { code: "PL005", name: "Amora Jakarta" },
    { code: "PL006", name: "Amora Yogyakarta" },
    { code: "PL007", name: "Amora Bandung" },
    { code: "PL008", name: "Amora Surabaya" },
    { code: "PL009", name: "Amora Makassar" },
    { code: "PL010", name: "Amora Singapore" },
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
