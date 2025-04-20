<template>
  <div>
    <img v-if="params.value == 'P'" src="/images/icons/comp.png" width="18" height="18" />
    <img v-else-if="params.value == 'H'" src="/images/icons/hu.png" width="18" height="18" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "comp_hu_icon",
  props: ["params"]
});
</script>
