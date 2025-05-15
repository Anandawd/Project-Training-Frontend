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
    { code: "D001", name: "Executive" },
    { code: "D002", name: "Human Resources" },
    { code: "D003", name: "Finance" },
    { code: "D004", name: "Information Technology" },
    { code: "D005", name: "Marketing" },
    { code: "D006", name: "Sales" },
    { code: "D007", name: "Operations" },
    { code: "D008", name: "Front Office" },
    { code: "D009", name: "Housekeeping" },
    { code: "D010", name: "Food & Beverage" },
    { code: "D011", name: "Engineering" },
    { code: "D012", name: "Security" },
    { code: "D013", name: "Spa & Wellness" },
    { code: "D014", name: "Events & Conferences" },
    { code: "D015", name: "Training & Development" },
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
    { code: "SPV001", name: "Jane Doe" },
    { code: "SPV002", name: "Michael Brown" },
    { code: "SPV003", name: "Emily Davis" },
    { code: "SPV004", name: "Lisa Anderson" },
    { code: "SPV005", name: "Kevin Martinez" },
    { code: "SPV006", name: "Patricia Hall" },
    { code: "SPV007", name: "Nancy Young" },
    { code: "SPV008", name: "Susan Clark" },
    { code: "SPV009", name: "Brian Turner" },
    { code: "SPV010", name: "Elizabeth Scott" },
    { code: "SPV011", name: "Laura Nelson" },
    { code: "SPV012", name: "Maria Gonzalez" },
    { code: "SPV013", name: "Samuel Green" },
    { code: "SPV014", name: "Rebecca White" },
    { code: "SPV015", name: "Amanda Parker" },
  ];

  managerOptions: any = [
    { code: "MGR001", name: "John Smith" },
    { code: "MGR002", name: "Sarah Johnson" },
    { code: "MGR003", name: "Robert Chen" },
    { code: "MGR004", name: "David Wilson" },
    { code: "MGR005", name: "Jennifer Garcia" },
    { code: "MGR006", name: "Thomas Wright" },
    { code: "MGR007", name: "Charles Lopez" },
    { code: "MGR008", name: "Daniel Lee" },
    { code: "MGR009", name: "Jessica Walker" },
    { code: "MGR010", name: "Richard Baker" },
    { code: "MGR011", name: "Andrew Miller" },
    { code: "MGR012", name: "James Carter" },
    { code: "MGR013", name: "Michelle Adams" },
    { code: "MGR014", name: "Christopher Hill" },
    { code: "MGR015", name: "Jonathan Evans" },
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
