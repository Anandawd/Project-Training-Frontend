<template>
  <div>
    <img
      v-if="params.value"
      src="/images/icons/repeater_guest_icon.png"
      width="18"
      height="18"
      title="Repeater Guest"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "repeater_guest_icon",
  props: ["params"],
});
</script>
