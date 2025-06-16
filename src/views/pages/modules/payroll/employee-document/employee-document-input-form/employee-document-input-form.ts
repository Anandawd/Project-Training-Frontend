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
    employeeOptions: {
      type: Array,
      default: (): any[] => [],
    },
    documentTypeOptions: {
      type: Array,
      default: (): any[] => [],
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
  employeeOptions!: any[];
  documentTypeOptions!: any[];

  public defaultForm: any = {};
  public form: any = reactive({});

  columnOptions = [
    {
      label: "name",
      field: "FullName",
      align: "left",
      width: "200",
    },
    {
      field: "employee_id",
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
      id: "",
      employee_id: "",
      document_type_code: "",
      file_name: "",
      file_path: "",
      file_size: 0,
      file_type: "",
      issue_date: "",
      expiry_date: "",
      remark: "",
      status: "",
      created_at: "",
      created_by: "",
      updated_at: "",
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
    console.log("onSave", this.form);
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

  onEmployeeChange() {
    if (this.form.employee_id) {
      const selectedEmployee = this.employeeOptions.find(
        (emp: any) => emp.employee_id === this.form.employee_id
      );

      if (selectedEmployee) {
        this.form.employee_name = selectedEmployee.FullName;
        this.form.Position = selectedEmployee.Position;
        this.form.Department = selectedEmployee.Department;
        this.form.Placement = selectedEmployee.Placement;
      }
    } else {
      this.form.employee_name = "";
      this.form.Position = "";
      this.form.Department = "";
      this.form.Placement = "";
    }
  }

  onDocumentTypeChange() {
    const selected = this.documentTypeOptions.find(
      (d: any) => d.code === this.form.document_type_code
    );

    if (selected) {
      this.form.document_type_code = selected.code;
      this.form.is_allow_expiry = selected.is_allow_expiry;
    } else {
      this.form.document_type_code = "";
      this.form.is_allow_expiry = 0;
    }
  }

  // validation
  get schema() {
    return Yup.object().shape({
      SelectEmployee: Yup.string().required(),
      // DocumentType: Yup.string().required(),
      // DocumentFile: Yup.string().required(),
      IssueDate: Yup.date().required(),
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

  get showExpiryDate() {
    return this.form.is_allow_expiry === 1;
  }
}
