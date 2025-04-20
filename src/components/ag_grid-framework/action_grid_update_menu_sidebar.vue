<template>
  <div v-if="params.data && params.data.number > 0" class="action-button">
    <button
      type="button"
      class="btn btn-link"
      @click="showSidebar"
      style="margin-top: -2px"
    >
      <i class="fa fa-bars"></i>
    </button>
    <button
      v-if="
        params.data.folio_status != 'Closed' &&
        params.data.folio_status != 'Cancel Check In'
      "
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
      v-if="
        params.data.folio_status != 'Closed' &&
        params.data.folio_status != 'Cancel Check In' &&
        params.data.folio_status != 'Open'
      "
      type="button"
      class="btn btn-flat"
      @click="handleDuplicate"
      style="margin-top: -5px"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/duplicate_icon24.png"
      />
    </button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import global from "@/utils/global";

export default defineComponent({
  name: "action_grid_sidebar",
  props: ["params"],
  setup(props) {
    const iconSize = global.iconSize;
    function handleEdit(modeData: any) {
      if (props.params.data !== undefined) {
        props.params.context.componentParent.onEdit(props.params.value);
      } else {
        openUndefinedAlert();
      }
    }

    function handleDuplicate() {
      if (props.params.data !== undefined) {
        props.params.context.componentParent.onDuplicate(props.params.value);
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

    function showSidebar() {
      if (props.params.data !== undefined) {
        props.params.context.componentParent.onShowMenu();
      } else {
        openUndefinedAlert();
      }
    }

    function openUndefinedAlert() {
      //TODO add dialog
    }

    function openConfirm() {
      //TODO add dialog
    }

    function acceptAlert() {
      //TODO add dialog
    }

    return {
      showSidebar,
      handleEdit,
      handleDuplicate,
      iconSize,
    };
  },
});
</script>
