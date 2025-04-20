<template>
  <div v-if="params.data">
    <icon-clean v-if="data === 'Clean'"></icon-clean>
    <icon-ready v-else-if="data === 'Ready'"></icon-ready>
    <icon-dirty v-else></icon-dirty>
  </div>
</template>
<script lang="ts">
import { defineComponent, shallowRef } from "vue";
import IconClean from "@/assets/icon/IconClean.vue";
import IconReady from "@/assets/icon/IconReady.vue";
import IconDirty from "@/assets/icon/IconDirty.vue";

export default defineComponent({
  name: "room_status_icon",
  components: {
    "icon-clean": shallowRef(IconClean),
    "icon-ready": shallowRef(IconReady),
    "icon-dirty": shallowRef(IconDirty),
  },
  props: ["params"],
  setup(props) {
    let data = null;
    const cellValue = props.params.valueFormatted
      ? props.params.valueFormatted
      : props.params.value;
    return {
      cellValue,
      data,
    };
  },
  mounted() {
    if (this.params.data) {
      this.data = `${this.params.value}`;
    }
  },
});
</script>
