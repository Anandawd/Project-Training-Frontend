import { v4 as uuidv4 } from "uuid";
import { useField } from "vee-validate";
import { computed, onMounted, ref, watch } from "vue";
import DatePicker from "vue-datepicker-next";
import $global from "@/utils/global";
// import
import "vue-datepicker-next/index.css";

export default {
  components: { DatePicker },
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    multicol: {
      type: Boolean,
      default: false,
    },
    half: {
      type: Boolean,
      default: false,
    },
    inlineLabel: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
    },
    modelValue: [String, Number],
    icon: String,
    type: String,
    inline: Boolean,
    customLabelClass: String,
    customClass: String,
    label: String,
    placeholder: String,
    autocomplete: String,
    name: {
      type: String,
      required: true,
    },
    validate: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    range: Boolean,
    disabledDate: Function,
    clearable: Boolean,
    valueType: String,
    format: String,
    resetButton: Boolean,
    confirm: Boolean,
    showError: Boolean,
  },
  emits: ["update:modelValue", "input", "reset", "change"],
  setup(props: any, context: any) {
    let refElement = ref(null);
    const showTimePanel = ref(false);
    const ID = uuidv4();
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, (value) => !!value, {
      initialValue: props.modelValue !== undefined ? props.modelValue : "",
    });

    const toggleTimePanelDatePicker = () => {
      showTimePanel.value = !showTimePanel.value;
    };

    const displayValue = computed({
      get() {
        const value = props.modelValue;
        if (value === $global.nullDate) {
          return "";
        }
        return props.modelValue;
      },
      set(val) {
        if (val === "") {
          val = $global.nullDate;
        }
        context.emit("update:modelValue", val);
        context.emit("input");
      },
    });

    function onchange(event: any) {
      if (!showTimePanel.value) showTimePanel.value = true;
      handleChange(event);
      context.emit("change", event);
    }
    function change(event: any) {
      context.emit("click", event);
    }
    function pick(event: any) {
      context.emit("pick", event);
    }

    // watch works directly on a ref
    watch(displayValue, async (nVal, oVal) => {
      inputValue.value = nVal;
    });

    onMounted(() => {
      const cl = document.getElementsByClassName(ID);
      if (cl.length > 0) {
        const inputEl = cl[0].getElementsByTagName("input");
        if (inputEl) {
          inputEl[0].setAttribute("id", ID);
        }
      }
    });

    return {
      pick,
      change,
      onchange,
      handleBlur,
      displayValue,
      errorMessage,
      meta,
      inputValue,
      ID,
      showTimePanel,
      refElement,
      toggleTimePanelDatePicker,
    };
  },
};
