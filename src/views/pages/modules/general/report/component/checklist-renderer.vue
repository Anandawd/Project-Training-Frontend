<template>
  <input
    v-if="!params.node.rowPinned"
    type="checkbox"
    id="isCogsRender"
    name="isCogsRender"
    @click="checkedHandler"
    :checked="params.value"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CheckListRenderer",
  props: {
    params: Object,
  },
  setup(props) {
    const checkedHandler = (event: Event) => {
      const checked = (event.target as HTMLInputElement).checked;
      const colId = props.params?.column.colId;
      props.params?.node.setDataValue(colId, checked);
    };

    return {
      checkedHandler,
    };
  },
});
</script>
