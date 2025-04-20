<template>
  <div>
    <c-select
      required
      expandOnMounted
      v-model="data"
      :selectType="selectType"
      :columnOptions="columnOptions"
      :options="options"
      :labelName="labelName"
      :keyName="keyName"
      @change="onChange"
    ></c-select>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import CSelect from "@/components/select/select.vue";
export default defineComponent({
  name: "selectCellEditor",
  components: {
    "c-select": CSelect,
  },
  props: ["params"],
  setup(props) {
    let data = ref();

    function afterGuiAttached() {
      data.value = props.params.value;
    }

    const columnOptions = computed(() => {
      return props.params.columnOptions;
    });
    const selectType = computed(() => {
      return props.params.selectType;
    });
    const options = computed(() => {
      return props.params.options;
    });
    const keyName = computed(() => {
      return props.params.keyName;
    });
    const labelName = computed(() => {
      return props.params.labelName;
    });
    const getValue = () => {
      return data.value;
    };

    const isPopup = () => {
      return true;
    };

    function init() {}

    function onChange() {
      props.params.stopEditing();
    }

    return {
      data,
      columnOptions,
      isPopup,
      init,
      afterGuiAttached,
      onChange,
      options,
      getValue,
      keyName,
      labelName,
      selectType,
    };
  },
  // mounted() {
  //   if (this.params.value) {
  //     console.log(this.params);

  //     this.data = this.params.value;
  //   }
  // }
});
</script>
