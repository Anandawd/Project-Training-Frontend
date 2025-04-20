import { Options, Vue } from "vue-class-component";
import { v4 as uuidv4 } from "uuid";

@Options({
  name: "app-checkbox",
  props: {
    modelValue: { default: "" },
    label: {
      type: String,
    },
    name: {
      type: String,
    },
    title: {
      type: String,
    },
    value: {
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "change"],
})
export default class CRadio extends Vue {
  private ID: string = uuidv4();
  private modelValue: string;
  private type: string;
  private value: string;

  public onValueChange(event: any) {
    let val = event.target.value;
    this.$emit("update:modelValue", val);
    this.$emit("change", val);
  }

  get isChecked() {
    return this.modelValue == this.value;
  }
}
