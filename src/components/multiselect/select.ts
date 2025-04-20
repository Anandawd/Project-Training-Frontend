
import { useField } from "vee-validate";
import { v4 as uuidv4 } from 'uuid';
import { ref, Ref, watch, computed } from "vue";

// import Multiselect from '@vueform/multiselect'
import VSelect from "vue-select";


export default {
  components: { VSelect },
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    max: {
      type: [String, Number],
      default: 255
    },
    multicol: {
      type: Boolean,
      default: false
    },
    half: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
    },
    modelValue: [String, Number, Object, Array],
    icon: String,
    type: {
      type: String,
      default: 'default'
    },
    options: {
      type: Array,
      default: []
    },
    inline: Boolean,
    label: String,
    placeholder: String,
    autocomplete: String,
    successMessage: String,
    name: {
      type: String,
      required: true
    },
    validate: {
      type: Boolean,
      default: false
    },
    keyName: {
      type: String,
    },
    labelName: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    reduce: {
      type: Function,
      default: (option: any) => option.code,
    },
  },
  emits: ['update:modelValue'],
  setup(props: any, context: any) {
    let refElement = ref(null);
    let data = ref()
    // we don't provide any rules here because we are using form-level validation
    // https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
    function onValueChange(value: any) {
      // multi value
      if (value.constructor == Array) {
        let val = [];
        for (const i in value) {
          val.push(getKey(value[i]))
        }
        handleChange(val);
        context.emit('update:modelValue', val);
        return
      }
      // single value
      let newVal = getKey(value);
      handleChange(newVal);
      context.emit('update:modelValue', newVal);
    }

    function deselect(val: any) {
      // deselect item in array
      if (data.value && data.value.constructor == Array) {
        let currentVal = data.value
        let index = currentVal.indexOf(getKey(val))
        if (index >= 0) {
          currentVal.splice(index, 1);
        }
        return context.emit('update:modelValue', currentVal);

      }
      // deselect an item
      context.emit('update:modelValue', "");
    }

    function getKey(val: any) {
      if (props.keyName) {
        return val[props.keyName]
      }

      return val;
    }


    function getLabel(val: any) {
      if (props.labelName) {
        return val[props.labelName]
      }

      return val;
    }

    const isNoneSelected = computed(() => {
      if (props.options.length > 0) {
        return false;
      }

      return true;
    });


    const ID = uuidv4();
    const {
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, (value) => !!value, {
      initialValue: props.modelValue,
    });

    return {
      deselect,
      data,
      refElement,
      handleChange,
      onValueChange,
      getKey,
      getLabel,
      handleBlur,
      errorMessage,
      isNoneSelected,
      meta,
      ID,
    };
  },
  mounted() {
    let selectElementIconDown = document.querySelector(`.c-select .vs__open-indicator`);
    let selectElementClear = document.querySelector(".c-select .vs__clear svg");
    let selectElementButtonClear = document.querySelector(".c-select .vs__clear");

    //resize icon
    selectElementIconDown.setAttribute('viewBox', '0 0 20 20');
    selectElementClear.setAttribute('viewBox', '0 0 20 20');
    // add event deselect 
    selectElementButtonClear.addEventListener("click", this.deselect, false)
  },
  watch: {
    modelValue(val: any) {
      this.data = val
    }
  }
};