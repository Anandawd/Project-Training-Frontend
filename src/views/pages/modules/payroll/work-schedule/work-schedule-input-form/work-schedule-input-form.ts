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
  public isSave: boolean = false;

  public defaultForm: any = {};
  public form: any = reactive({});

  selectEmployeeOptions: any = [
    {
      SubGroupName: "Placement",
      code: "EMP001",
      name: "John Doe",
    },
    {
      SubGroupName: "Placement",
      code: "EMP002",
      name: "Deddy Cagur",
    },
  ];
  leaveTypeOptions: any = [
    {
      SubGroupName: "Type",
      code: "T01",
      name: "Annual Leave",
    },
    {
      SubGroupName: "Type",
      code: "T02",
      name: "Sick Leave",
    },
    {
      SubGroupName: "Type",
      code: "T03",
      name: "Maternity Leave",
    },
    {
      SubGroupName: "Type",
      code: "T04",
      name: "Paternity Leave",
    },
    {
      SubGroupName: "Type",
      code: "T05",
      name: "Marriage Leave",
    },
    {
      SubGroupName: "Type",
      code: "T06",
      name: "Bereavement Leave",
    },
    {
      SubGroupName: "Type",
      code: "T07",
      name: "Unpaid Leave",
    },
    {
      SubGroupName: "Type",
      code: "T08",
      name: "Public Holiday",
    },
    {
      SubGroupName: "Type",
      code: "T09",
      name: "Compassionate Leave",
    },
    {
      SubGroupName: "Type",
      code: "T10",
      name: "Study Leave",
    },
    {
      SubGroupName: "Type",
      code: "T11",
      name: "Special Leave",
    },
    {
      SubGroupName: "Type",
      code: "T12",
      name: "Emergency Leave",
    },
    {
      SubGroupName: "Type",
      code: "T13",
      name: "Religious Leave",
    },
    {
      SubGroupName: "Type",
      code: "T14",
      name: "Quarantine Holiday",
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
      employee_id: "",
      employee_name: "",
      employee_department: "",
      employee_position: "",
      total_quota_leave: 0,
      total_remaining_leave: 0,
      leave_type: "",
      reason: "",
      start_date: new Date(),
      end_date: new Date(),
      remark: "",
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
