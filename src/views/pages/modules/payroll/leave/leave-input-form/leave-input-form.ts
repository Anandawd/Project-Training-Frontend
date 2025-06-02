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
    leaveTypeOptions: {
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
  leaveTypeOptions!: any[];

  public form: any = reactive({});

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

  columnEmployeeOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "employee_id",
      label: "id",
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
      employee_id: "",
      employee_name: "",
      department_code: "",
      department_name: "",
      position_code: "",
      position_name: "",
      placement_code: "",
      placement_name: "",
      total_quota_leave: 0,
      total_remaining_leave: 0,
      leave_type_name: "",
      leave_type_code: "",
      reason: "",
      start_date: new Date(),
      end_date: new Date(),
      total_days: 0,
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

  onEmployeeChange() {
    if (this.form.employee_id) {
      const selectedEmployee = this.employeeOptions.find(
        (emp: any) => emp.employee_id === this.form.employee_id
      );

      if (selectedEmployee) {
        this.form.employee_name = selectedEmployee.name;
        this.form.department_code = selectedEmployee.department_code;
        this.form.department_name = selectedEmployee.department_name;
        this.form.position_code = selectedEmployee.position_code;
        this.form.position_name = selectedEmployee.position_name;
        this.form.placement_code = selectedEmployee.placement_code;
        this.form.placement_name = selectedEmployee.placement_name;
        this.form.total_quota_leave = selectedEmployee.total_quota_leave;
        this.form.total_remaining_leave =
          selectedEmployee.total_remaining_leave;
      }
    } else {
      this.form.employee_name = "";
      this.form.department_code = "";
      this.form.department_name = "";
      this.form.position_code = "";
      this.form.position_name = "";
      this.form.placement_code = "";
      this.form.placement_name = "";
      this.form.total_quota_leave = 0;
      this.form.total_remaining_leave = 0;
    }
  }

  onLeaveTypeChange() {
    const selectedOptions = this.leaveTypeOptions.find(
      (item: any) => item.code === this.form.leave_type_code
    );

    if (selectedOptions) {
      this.form.leave_type_code = selectedOptions.code;
      this.form.leave_type_name = selectedOptions.name;
    } else {
      this.form.leave_type_code = "";
      this.form.leave_type_name = "";
    }
  }

  onDateChange() {
    if (this.form.start_date || this.form.end_date) {
      // menghitung total_days
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
}
