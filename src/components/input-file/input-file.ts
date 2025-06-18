import { v4 as uuidv4 } from "uuid";
import { useField } from "vee-validate";
import { computed, ref } from "vue";

export default {
  name: "c-input-file",
  props: {
    // Inherit most props from c-input
    required: { type: Boolean, default: false },
    multicol: { type: Boolean, default: false },
    half: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    focus: { type: Boolean, default: false },
    customLabelClass: String,
    customClass: String,
    modelValue: [Array, File, null],
    inlineLabel: { type: Boolean, default: true },
    label: String,
    placeholder: String,
    name: { type: String, required: true },
    valid: { type: Boolean, default: true },
    errorText: { type: String },
    showError: { type: Boolean, default: false },
    tabindex: { type: Number },

    // File-specific props
    accept: { type: String, default: "" },
    multiple: { type: Boolean, default: false },
    buttonText: { type: String, default: "Choose File" },
    buttonClass: { type: String, default: "btn-outline-primary" },
    buttonIcon: { type: String, default: "fa fa-upload" },
    showPlaceholder: { type: Boolean, default: true },

    existingFileName: { type: String, default: "" },
    showExistingFile: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  setup(props: any, { emit }: any) {
    const ID = uuidv4();
    const selectedFiles = ref([]);

    const {
      value: inputValue,
      errorMessage,
      meta,
    } = useField(props.name, (value) => !!value, {
      initialValue: props.modelValue !== undefined ? props.modelValue : null,
    });

    // Initialize from modelValue if it exists
    if (props.modelValue) {
      if (Array.isArray(props.modelValue)) {
        selectedFiles.value = [...props.modelValue];
      } else {
        selectedFiles.value = [props.modelValue];
      }
    }

    const displayPlaceholder = computed(() => {
      if (selectedFiles.value.length > 0) {
        return false;
      }

      if (props.showExistingFile && props.existingFileName) {
        return ` ${props.existingFileName}`;
      }

      return props.placeholder || "No file selected";
    });

    const handleFileChange = (event: any) => {
      const files = Array.from(event.target.files || []);

      if (files.length === 0) return;

      if (props.multiple) {
        selectedFiles.value = [...files];
        emit("update:modelValue", files);
      } else {
        selectedFiles.value = [files[0]];
        emit("update:modelValue", files[0]);
      }

      // Reset the input to allow selecting the same file again
      event.target.value = "";
    };

    const removeFile = (index: any) => {
      selectedFiles.value.splice(index, 1);

      if (props.multiple) {
        emit("update:modelValue", [...selectedFiles.value]);
      } else {
        emit(
          "update:modelValue",
          selectedFiles.value.length > 0 ? selectedFiles.value[0] : null
        );
      }
    };

    return {
      ID,
      handleFileChange,
      removeFile,
      selectedFiles,
      inputValue,
      errorMessage,
      meta,
      displayPlaceholder,
    };
  },
};
