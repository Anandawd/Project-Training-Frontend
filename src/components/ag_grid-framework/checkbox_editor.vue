<template>
  <div v-if="params.node.rowPinned"></div>
  <div v-else>
    <c-checkbox
      v-if="params.value !== null && params.value !== undefined"
      style="margin-left: 25%"
      booleanValue
      v-model="data"
      @change="onChange"
    ></c-checkbox>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import CCheckbox from "../checkbox/checkbox.vue";
export default defineComponent({
  name: "checkbox-editor",
  components: {
    "c-checkbox": CCheckbox,
  },
  props: ["params"],
  setup(props) {
    let data = ref();

    function afterGuiAttached() {
      data.value = !props.params.value;
      props.params.stopEditing();
    }

    const getValue = () => {
      return data.value;
    };

    const isPopup = () => {
      return false;
    };

    function init() {
      // console.log('masuk');
    }

    function onChange() {
      console.log("ubah");
      // props.params.setDataValue("");
      props.params.stopEditing();
    }

    return {
      data,
      isPopup,
      init,
      afterGuiAttached,
      onChange,
      getValue,
    };
  },
});
</script>
