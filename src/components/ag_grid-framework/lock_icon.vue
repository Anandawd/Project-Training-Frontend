<template>
  <div v-if="!params.node.rowPinned">
    <img
      v-if="params.value"
      src="/images/icons/lock_icon32.png"
      height="18"
      width="18"
      title="Locked"
    />
    <!-- <img v-else src="/images/icons/unlock_icon32.png" height="18" width="18" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "lock_icon",
  props: ["params"],
  setup(props) {
    const cellValue = props.params.valueFormatted
      ? props.params.valueFormatted
      : props.params.value;
    return {
      cellValue,
    };
  },
});
</script>
