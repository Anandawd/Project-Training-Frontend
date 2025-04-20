<template>
  <div>
    <img
      v-if="params.value"
      src="/images/icons/inc.png"
      width="18"
      height="18"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "incognito_icon",
  props: ["params"],
});
</script>
