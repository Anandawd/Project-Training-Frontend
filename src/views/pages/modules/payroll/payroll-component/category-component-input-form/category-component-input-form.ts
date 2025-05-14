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
  public activeTab: string = "category";

  public form: any = reactive({});

  // form settings
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];
  typeOptions: any = [
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

  booleanOptions: any = [
    {
      SubGroupName: "Options",
      code: "YES",
      name: "Yes",
    },
    {
      SubGroupName: "Options",
      code: "NO",
      name: "No",
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
      categoryCode: "",
      categoryName: "",
      categoryDescription: "",
      categoryType: "",
      categoryStatus: "A",
      entityType: "category",
      id: undefined,
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

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // validation
  get schema() {
    return Yup.object().shape({
      // categoryCode: Yup.string().when([], {
      //   is: () => this.activeTab === "category",
      //   then: Yup.string().required("Code is required"),
      // }),
      // categoryName: Yup.string().when([], {
      //   is: () => this.activeTab === "category",
      //   then: Yup.string().required("Name is required"),
      // }),
      // categoryType: Yup.string().when([], {
      //   is: () => this.activeTab === "category",
      //   then: Yup.string().required("Type is required"),
      // }),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.table.payroll.payroll.categoryComponent"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.table.payroll.payroll.categoryComponent"
      )}`;
    }
  }
}
