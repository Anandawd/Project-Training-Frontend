<template>
  <div class="flex action-button">
    <button
      type="button"
      class="btn btn-flat"
      @click="handleEdit"
      style="margin-top: -5px"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/edit_icon24.png"
      />
    </button>
    <button
      type="button"
      class="btn btn-flat"
      @click="handleDelete"
      style="margin-top: -5px"
    >
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
import { computed, defineComponent } from "vue";
import { BDropdown, BDropdownItem } from "bootstrap-vue-3";
import global from "@/utils/global";

export default defineComponent({
  name: "action_grid",
  components: {
    BDropdown,
    BDropdownItem,
  },
  props: ["params"],
  setup(props: any) {
    const iconSize = global.iconSize;
    const paramsParent = computed(() => {
      return props.params.context.componentParent;
    });
    function handleMenu() {
      //
    }

    function handleEdit() {
      paramsParent.value.handleEdit(props.params.data);
      //
    }

    function handleDelete() {
      paramsParent.value.handleDelete(props.params.data);
    }

    function showPopUp(modeData: any) {
      if (props.params.data !== undefined) {
        paramsParent.value.showModal(props.params.data, modeData);
      } else {
        openUndefinedAlert();
      }
    }

    function openAlert() {
      if (props.params.data !== undefined) {
        openConfirm();
      } else {
        openUndefinedAlert();
      }
    }

    function openUndefinedAlert() {
      alert("undefined");
    }

    function openConfirm() {
      alert("confirm");
    }

    return {
      iconSize,
      handleMenu,
      handleEdit,
      handleDelete,
    };
  },
});
</script>
