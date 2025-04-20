<template>
  <div>
    <img
      v-if="params.value"
      src="/images/icons/color_to_do_icon24.png"
      width="18"
      title="Guest To Do"
      height="18"
    />
    <b-badge v-if="params.value > 0" class="ml-1" variant="danger"
      >{{ params.value }} <span class="sr-only">To do count</span></b-badge
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BBadge } from "bootstrap-vue-3";

export default defineComponent({
  name: "to_do_icon",
  components: {
    "b-badge": BBadge,
  },
  props: ["params"],
});
</script>
