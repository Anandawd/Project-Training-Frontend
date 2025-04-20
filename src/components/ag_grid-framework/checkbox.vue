<template>
  <div v-if="params.node.rowPinned"></div>
  <div v-else>
    <!-- <div
      v-if="params.value !== null && params.value !== undefined"
      style="margin-left: 25%"
    > -->
    <c-checkbox booleanValue v-model="data" @change="onChange"></c-checkbox>
    <!-- </div> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import CCheckbox from "../checkbox/checkbox.vue";
export default defineComponent({
  name: "checkbox-editor",
  components: {
    "c-checkbox": CCheckbox,
  },
  props: ["params"],
  setup(props) {
    let data = computed(() => {
      if (props.params.value == undefined) {
        return false;
      }
      return props.params.value;
    });
    function onChange() {
      console.log("changed");
    }

    return {
      data,
      onChange,
    };
  },
});
</script>
