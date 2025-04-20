import { Options, Vue } from "vue-class-component";
import { v4 as uuidv4 } from "uuid";
import { boolean } from "yup";

@Options({
  name: "app-checkbox",
  props: {
    modelValue: { type: [Number, Boolean], default: 0 },
    type: {
      type: String,
      default: "default",
    },
    label: {
      type: String,
    },
    title: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    booleanValue: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
  },
  emits: ["update:modelValue"],
})
export default class CCheckbox extends Vue {
  private ID: string = uuidv4();
  private booleanValue: boolean;
  private value: string;

  public onValueChange(event: any) {
    this.$emit("change", event);
    if (this.booleanValue) {
      return this.$emit("update:modelValue", !!event.target.checked);
    }
    if (this.value) {
      return this.$emit(
        "update:modelValue",
        event.target.checked ? this.value : ""
      );
    }
    let val = event.target.checked ? 1 : 0;
    this.$emit("update:modelValue", val);
  }
}
