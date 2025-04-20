<template>
  <div v-if="params.data" class="flex action-button">
    <button type="button" @click="deleteData()" style="height: 30px">
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/delete_icon24.png"
      />
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import global from "@/utils/global";
export default defineComponent({
  name: "action_grid_resv",
  components: {},
  props: ["params"],
  setup(props: any) {
    const iconSize = global.iconSize;
    function deleteData() {
      props.params.node.setSelected(true, true);
      setTimeout(
        () => props.params.context.componentParent.handleDeleteData(),
        100
      );
    }

    return {
      deleteData,
      iconSize,
    };
  },
});
</script>
