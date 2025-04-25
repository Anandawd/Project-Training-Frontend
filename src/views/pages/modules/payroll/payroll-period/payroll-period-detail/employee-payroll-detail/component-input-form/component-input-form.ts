import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { focusOnInvalid } from "@/utils/validation";
import { Form as CForm } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  name: "ComponentInputForm ",
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
export default class ComponentInputForm extends Vue {
  inputFormValidation: any = ref();
  modeData!: any;
  public isSave: boolean = false;

  public defaultForm: any = {};
  public form: any = reactive({
    type: "",
    component: "",
    amount: 0,
    quantity: 1,
    unit: "",
  });

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
      code: "E",
      name: "Earnings",
    },
    {
      SubGroupName: "Type",
      code: "D",
      name: "Deductions",
    },
    {
      SubGroupName: "Type",
      code: "S",
      name: "Statutory",
    },
  ];
  componentOptions: any = [
    {
      SubGroupName: "Component",
      code: "EC01",
      name: "Tunjangan Makan",
    },
    {
      SubGroupName: "Component",
      code: "EC02",
      name: "Tunjangan Jabatan",
    },
    {
      SubGroupName: "Component",
      code: "EC03",
      name: "Tunjangan Transportasi",
    },
    {
      SubGroupName: "Component",
      code: "EC04",
      name: "Bonus",
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
    if (this.inputFormValidation) {
      this.inputFormValidation.resetForm();
    }
    await this.$nextTick();
    this.form = {
      type: "",
      component: "",
      amount: 0,
      quantity: 1,
      unit: "",
    };
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    if (this.inputFormValidation && this.inputFormValidation.$el) {
      this.inputFormValidation.$el.requestSubmit();
    } else {
      this.onSave();
    }
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
      type: Yup.string().required("Component type is required"),
      component: Yup.string().required("Component is required"),
    });
  }
}
