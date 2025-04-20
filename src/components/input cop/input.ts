import {v4 as uuidv4} from 'uuid';
import { useField } from 'vee-validate';
import { computed, watch } from "vue"; 


export default { 
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
    modelValue: [String, Number],
    icon: String,
    type: String,
    inline: Boolean,
    label: String,
    placeholder: String,
    autocomplete: String,
    name: {
        type: String,
        required: true
    },
    validate: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props: any, context: any) {  
    const ID = uuidv4();
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, (value) => !!value, {
      initialValue: props.modelValue !== undefined ? props.modelValue : '',
    }); 

    watch(inputValue, (val, vala) => {
      if (val !== undefined) {
        console.log(val)
        context.emit('update:modelValue', val); 
      }
    })

    // const displayValue = computed({
    //   get
    // })

    return {
      handleChange, 
      handleBlur,
      errorMessage, 
      meta, 
      inputValue, 
      ID, 
    };
  }
  
};