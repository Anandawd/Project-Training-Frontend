import { BFormInput } from "bootstrap-vue-3";
import { v4 as uuidv4 } from "uuid";
import { useField } from "vee-validate";
import { computed, ref, watch } from "vue";

export default {
  name: "c-input",
  components: {
    BFormInput,
  },
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    max: {
      type: [String, Number],
    },
    multicol: {
      type: Boolean,
      default: false,
    },
    half: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    rows: [Number, String],
    min: {
      type: Number,
    },
    focus: {
      type: Boolean,
    },
    customLabelClass: String,
    customClass: String,
    modelValue: [String, Number],
    icon: String,
    type: String,
    inlineLabel: {
      type: Boolean,
      default: true,
    },
    label: String,
    placeholder: String,
    autocomplete: {
      type: String,
      default: "off",
    },
    name: {
      type: String,
      required: true,
    },
    validate: {
      type: Boolean,
      default: false,
    },
    // value: [Number, String],
    showZeroNumber: Boolean,
    comma: Number,
    formatted: Boolean,
    spinner: {
      type: Boolean,
      default: false,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    errorText: {
      type: String,
    },
    showError: {
      type: Boolean,
    },
    uppercase: {
      type: Boolean,
    },
    tabindex: {
      type: Number,
    },
  },
  emits: ["update:modelValue", "clickCustom", "inputCustom"],
  setup(props: any, context: any) {
    const ID = uuidv4();
    let isInputActive = ref(false);
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, (value) => !!value, {
      initialValue: props.modelValue !== undefined ? props.modelValue : "",
    });

    const select = (event: any) => {
      context.emit("clickCustom");
    };
    const countDecimals = (value: any) => {
      if (Math.floor(value) !== value)
        return value.toString().split(".")[1].length || 0;
      return 0;
    };

    function addButton(event: any) {
      let val = displayValue.value.toString();
      val = parseFloat(val.replace(/[^\d.]/g, ""));
      if (isNaN(val)) {
        val = 1;
      } else {
        val++;
      }
      displayValue.value = val;
      context.emit("change", val);
    }

    function subButton(event: any) {
      let val = displayValue.value.toString();
      val = parseFloat(val.replace(/[^\d.]/g, ""));
      if (isNaN(val)) {
        val = 0;
      } else {
        if (val > 0) {
          val--;
        }
      }
      displayValue.value = val;
      context.emit("change", val);
    }

    const displayValue = computed({
      get() {
        if (
          (props.type != "number" && !props.spinner) ||
          props.type == "text"
        ) {
          if (props.modelValue == null) {
            // console.log("b", props.modelValue);
            context.emit("update:modelValue", "");
          }
          if (props.uppercase && props.modelValue) {
            let val = props.modelValue;
            return val.toUpperCase() ?? "";
          }
          // console.log("a", props.modelValue);

          return props.modelValue ?? "";
        }
        let value = props.modelValue;
        // console.log("a1", value);
        if (isNaN(value) || value == null || value == "") {
          value = props.showZeroNumber ? 0 : "";
          return value;
        }
        // console.log("a2", value);

        value = parseFloat(value);
        // console.log("a3", value);
        if (isInputActive.value) {
          // Cursor is inside the input field. unformat display value for user
          // return value.toString();
        }
        // User is not modifying now. Format display value for user interface
        if (value % 1 > 0) {
          // console.log("a4", value);
          if (props.comma > 0 && props.comma <= 3) {
            // console.log("a5", value);
            return parseFloat(value)
              .toFixed(props.comma)
              .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
          }
          if (countDecimals(value) <= 3) {
            // console.log("a6", value);
            return parseFloat(value)
              .toFixed(countDecimals(value))
              .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
          }
          if (countDecimals(value) > 3) {
            // console.log("a7", value);
            return parseFloat(value)
              .toFixed(3)
              .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
          }
        } else {
          // console.log("a8", value);
          if (props.comma > 0 && props.comma <= 3) {
            // console.log("a9", value);
            return parseFloat(value)
              .toFixed(props.comma)
              .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
          }
          // console.log("a10", value);
          return parseFloat(value)
            .toFixed(0)
            .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
        }
      },
      set(modifiedValue: any) {
        // Recalculate value after ignoring "$" and "," in user input
        let newValue = modifiedValue ?? "";
        if ((props.type === "number" && props.formatted) || props.spinner) {
          modifiedValue = modifiedValue.toString();
          // console.log("1", modifiedValue);
          newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ""));
          if (isNaN(newValue)) {
            newValue = 0;
          }
          // console.log("2", newValue);
          if (props.max > 0) {
            if (newValue > props.max) {
              newValue = props.max;
            }
          }
          if (props.min > 0) {
            if (newValue < props.min) {
              newValue = props.min;
            }
          }
          // console.log("3", newValue);
        }
        // console.log("4", newValue);
        context.emit("update:modelValue", newValue);
        // Note: we cannot set this.value as it is a "prop". It needs to be passed to parent component
        // $emit the event so that parent component gets it
        // if (countDecimals(newValue) <= 3) {
        //   context.emit('update:modelValue', newValue)
        // } else {
        //   //
        // }
      },
    });

    function onFocus(event: any) {
      isInputActive.value = true;
      if (props.selected) event.target.select();
    }

    // watch works directly on a ref
    watch(displayValue, async (nVal, oVal) => {
      if (props.type === "number" || props.spinner) return;
      inputValue.value = nVal;
    });

    return {
      onFocus,
      subButton,
      addButton,
      handleChange,
      handleBlur,
      errorMessage,
      meta,
      inputValue,
      ID,
      isInputActive,
      select,
      displayValue,
    };
  },
};
