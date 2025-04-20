import { useField } from "vee-validate";
import { v4 as uuidv4 } from "uuid";
import { computed, nextTick, ref, onMounted, watch, reactive } from "vue";
import { formatDate3, formatNumberValue } from "@/utils/format";
import _ from "lodash";

interface IColumnOptions {
  label: string;
  field: string;
  width: string;
  align?: string;
  format: string;
  offset: string;
}

export default {
  name: "CSelect",
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    max: {
      type: [String, Number],
      default: 255,
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
    min: {
      type: Number,
    },
    modelValue: [String, Number, Boolean, Array, Object],
    icon: String,
    type: {
      type: String,
      default: "default",
    },
    title: {
      type: String,
    },
    filter: {
      type: Boolean,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      require: true,
      default: [],
    },
    inline: Boolean,
    label: String,
    inlineLabel: {
      type: Boolean,
      default: true,
    },
    customLabelClass: String,
    customClass: String,
    placeholder: String,
    autocomplete: String,
    successMessage: String,
    clearable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      require: true,
    },
    validate: {
      type: Boolean,
      default: false,
    },
    keyName: {
      type: String,
    },
    labelName: {
      type: String,
    },
    initialValue: {
      type: [String, Number],
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    // single | multi | column
    selectType: {
      type: String,
      default: "single",
    },
    columnOptions: {
      type: Object as () => IColumnOptions,
      require: true,
    },
    offset: {
      type: String,
      default: "left",
    },
    expandOnMounted: {
      type: Boolean,
      default: false,
    },
    showError: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props: any, context: any) {
    let multiselectElement = ref();
    let columnElement = ref();
    let data = ref([]);
    let selectAll = ref(false);
    let selectSeveral = ref(false);
    let expanded = ref();
    let optionValue = ref();
    let searchInput = ref("");
    let searchInputColumn: any = reactive({});
    onMounted(async () => {
      if (props.expandOnMounted) {
        setTimeout(() => {
          expanded.value = true;
        }, 100);
      }
    });

    // we don't provide any rules here because we are using form-level validation
    // https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
    function getKey(val: any) {
      if (props.keyName) {
        if (typeof val == "object") {
          return val ? val[props.keyName] : "";
        }
      }
      return val;
    }

    function getLabel(val: any, isOption = false) {
      if (props.labelName) {
        if (optionValue.value && !isOption) {
          //value from type column
          val = optionValue.value;
        }

        if (typeof val == "object") {
          return val ? val[props.labelName] : "";
        }
      }
      return val;
    }

    function getFormatted(val: any, format: any) {
      if (format === "number") {
        return formatNumberValue(val);
      }
      if (format === "date") {
        return formatDate3(val);
      }
      return val;
    }

    // function filterOptions(event: any) {
    //   userInput = event.target.value;
    //   console.log("pp", userInput);
    // }

    const filteredOptions = computed(() => {
      if (!props.options) return [];
      if (!searchInput.value) return props.options;
      return props.options.filter((option: any) =>
        getLabel(option, true)
          .toLowerCase()
          .includes(searchInput.value.toString().toLowerCase())
      );
    });

    const filteredColumnOptions = computed(() => {
      if (!props.options) return [];
      if (!searchInputColumn) return props.options;
      let filtered = props.options;
      for (const i of props.columnOptions) {
        if (searchInputColumn[i.field]) {
          filtered = filtered.filter((option: any) =>
            option[i.field]
              .toString()
              .toLowerCase()
              .includes(searchInputColumn[i.field].toString().toLowerCase())
          );
        }
      }
      return filtered;
    });

    const isNoneSelected = computed(() => {
      if (!props.options) return true;
      if (!Array.isArray(props.options)) return true;
      const res =
        props.options.findIndex(
          (option: any) => option[props.keyName] === props.modelValue
        ) < 0;

      return res;
    });

    const isEmpty = computed(() => {
      if (!props.options) return true;
      if (!Array.isArray(props.options)) return true;
      return !(props.options.length > 0);
    });

    const ID = uuidv4();
    const filterID = uuidv4();
    const displayValue = computed({
      get() {
        if (props.multiple) {
          data.value = stringToArray(props.modelValue);
        }
        if (props.selectType == "column" || props.selectType == "single") {
          if (!props.modelValue) {
            optionValue.value = {};
          }
          if (props.selectType == "column" || props.selectType == "single") {
            if (props.options && Array.isArray(props.options)) {
              for (const i of props.options) {
                if (typeof props.modelValue == "object" && !props.keyName) {
                  if (JSON.stringify(i) === JSON.stringify(props.modelValue)) {
                    optionValue.value = i;
                    // console.log("masuk2", i);
                    // console.log("masuk22", props.modelValue);
                    break;
                  }
                } else {
                  if (getKey(i) === getKey(props.modelValue)) {
                    // console.log("masuk1", i);
                    // console.log("masuk12", props.modelValue);
                    optionValue.value = i;
                    break;
                  }
                }
                optionValue.value = null;
              }
            }
          }
        }
        return props.modelValue;
      },
      set(val) {
        let value = val;
        if (props.options && !Array.isArray(props.options)) {
          const res =
            props.options.findIndex(
              (option: any) => option[props.keyName] === props.modelValue
            ) < 0;
          if (res) {
            value = null;
          }
        }
        let eventData = {
          target: {
            value: value,
          },
        };
        // if (props.selectType == "column") {
        //   if (!props.modelValue) {
        //     optionValue.value = {}
        //   }
        //   let newVal;
        //   for (const i of props.options) {
        //     if (typeof props.modelValue == 'object' && !props.keyName) {
        //       if (JSON.stringify(i) == JSON.stringify(props.modelValue)) {
        //         newVal = i
        //         break
        //       }
        //     } else {
        //       if (getKey(i) == getKey(props.modelValue)) {
        //         newVal = i
        //         break
        //       }
        //     }
        //   }
        //   optionValue.value = newVal
        // }
        context.emit("update:modelValue", value);
        context.emit("change", eventData);
      },
    });
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, (value) => !!value, {});

    watch(displayValue, (nVal, oVal) => {
      inputValue.value = nVal;
    });

    watch(
      () => props.options,
      async (nVal, oVal) => {
        //remove value when key not exist
        await nextTick();
        // console.log('b4', optionValue.value);
        // console.log('find', props.options.find((val: any) => getKey(optionValue.value) == getKey(val)));
        if (!props.options) {
          displayValue.value = "";
          return;
        }
      }
    );

    // multiselect
    function clickOutside(event: any) {
      expanded.value = false;
    }

    function showCheckboxes() {
      if (!expanded.value && !props.disabled) {
        let el = multiselectElement.value;
        el.focus();
        expanded.value = true;
      } else {
        expanded.value = false;
      }
    }

    watch(selectAll, (nVal, oVal) => {
      if (nVal) {
        data.value = [];
        for (const el of props.options) {
          data.value.push(getKey(el));
        }
      } else {
        data.value = [];
      }
      displayValue.value = formatValue(data.value);
    });

    function formatValue(value: any[]) {
      let newVal = "";
      if (value.constructor == Array) {
        for (const el of value) {
          if (newVal) {
            newVal += "|";
          }
          newVal += el;
        }
      }
      return newVal;
    }

    function stringToArray(value: any) {
      if (!value) {
        return [];
      }

      if (value.constructor == String) {
        let val = value.split("|");
        return val;
      }

      if (value.constructor == Array) {
        return value;
      }
    }

    watch(data, (nVal, oVal) => {
      displayValue.value = formatValue(data.value);
      if (data.value.length > 0) {
        selectSeveral.value = true;
        if (data.value.length == props.options.length) {
          selectAll.value = true;
          selectSeveral.value = false;
        }
      } else {
        selectAll.value = false;
        selectSeveral.value = false;
      }
    });

    // =========================================== column

    let oldAttribute: any;
    let newAttribute: any;
    function onClickSelect() {
      if (props.selectType == "column") {
        for (const i of props.columnOptions) {
          searchInputColumn[i.field] = "";
        }
        expanded.value = !expanded.value;
        if (!displayValue.value) {
          if (newAttribute) {
            newAttribute.setAttribute("selected", "");
          }
        }
      } else {
        searchInput.value = "";
      }
      nextTick(() => {
        const focusEl =
          document.getElementById(filterID + "0") ??
          document.getElementById(filterID);
        if (focusEl) {
          focusEl.focus();
        }
      });
    }

    function onClickOption(event: any, option: any) {
      if (props.selectType == "column") {
        const el = event.currentTarget;
        oldAttribute = newAttribute;
        if (oldAttribute) {
          oldAttribute.setAttribute("selected", "");
        }
        newAttribute = el;
        newAttribute.setAttribute("selected", "selected");
        expanded.value = false;
      }
      displayValue.value = getKey(option);
    }

    const minWidth = computed(() => {
      if (!props.columnOptions) return 100;
      return props.columnOptions.reduce(
        (a: any, b: any) => a + parseFloat(b.width),
        50
      );
    });

    function onEnterFilter() {
      // const el = document.getElementById("dropdownMenu");
      // el.classList.remove("show");
      // for (const i in el) {
      //   const er = el[i].getElementsByClassName("show");
      //   er[0].remove();
      // }
    }

    //Select with arrow key
    function onKeyup(isUp: Boolean) {
      const res =
        filteredOptions.value.findIndex(
          (option: any) => option[props.keyName] === props.modelValue
        ) < 0;

      for (let i = 0; i < filteredOptions.value.length; i++) {
        if ((!props.modelValue || res) && filteredOptions.value) {
          if (i == 0) {
            displayValue.value = getKey(filteredOptions.value[0]);
            break;
          }
        }
        if (getKey(filteredOptions.value[i]) == props.modelValue) {
          let index = i;
          if (isUp) {
            index -= 1;
          } else {
            index += 1;
          }
          if (index < filteredOptions.value.length && index >= 0) {
            displayValue.value = getKey(filteredOptions.value[index]);
            break;
          }
        }
      }
    }

    return {
      onEnterFilter,
      onKeyup,
      getFormatted,
      multiselectElement,
      minWidth,
      clickOutside,
      onClickOption,
      onClickSelect,
      selectSeveral,
      selectAll,
      data,
      expanded,
      filteredOptions,
      searchInputColumn,
      // filterOptions,
      showCheckboxes,
      displayValue,
      handleChange,
      getKey,
      getLabel,
      handleBlur,
      errorMessage,
      isNoneSelected,
      meta,
      ID,
      filterID,
      filteredColumnOptions,
      searchInput,
      isEmpty,
    };
  },
};
