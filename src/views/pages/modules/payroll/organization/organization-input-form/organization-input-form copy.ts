import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CSelect from "@/components/select/select.vue";
import { focusOnInvalid } from "@/utils/validation";
import { Form } from "vee-validate";
import { reactive, ref } from "vue";
import { Options, Vue } from "vue-class-component";
import * as Yup from "yup";

@Options({
  name: "InputForm",
  components: {
    Form,
    CInput,
    CSelect,
    CDatepicker,
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
  modeDate: any;
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
  public colorForm: any = [
    { code: 0, name: "black" },
    { code: 1, name: "yellow" },
    { code: 2, name: "white" },
    { code: 3, name: "green" },
    { code: 4, name: "grey" },
    { code: 5, name: "blue" },
    { code: 6, name: "red" },
    { code: 7, name: "brown" },
  ];

  dropDownList: any = [
    {
      SubGroupName: "",
      code: "",
      name: "",
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
}
