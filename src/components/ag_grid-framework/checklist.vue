<template>
  <div v-if="params.node.rowPinned"></div>
  <div v-else>
    <div v-if="params.value !== null && params.value !== undefined">
      <i v-if="params.value == '1' || params.value == true" class="far fa-check-square" aria-hidden="true"></i>
      <i v-else class="far fa-square"></i>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "checklistIcon",
  props: ["params"],
  setup() {
    const data = "";
    return {
      data,
    };
  },
  mounted() {
    if (this.params.value) {
      this.data = this.params.value;
    }
  },
});
</script>