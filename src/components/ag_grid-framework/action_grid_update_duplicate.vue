<template>
  <div class="flex action-button">
    <b-dropdown
      size="lg"
      variant="link"
      toggle-class="text-decoration-none"
      no-caret
    >
      <template #button-content>
        <i class="fa fa-bars" aria-hidden="true"></i>
      </template>
      <b-dropdown-item @click="handleMenu()"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/tracking_icon24.png"
        />{{ $t("commons.menu.trackingData") }}</b-dropdown-item
      >
    </b-dropdown>
    <button
      type="button"
      :disabled="disabledActionGrid"
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
      :disabled="disabledActionGrid"
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
    const disabledActionGrid = computed(() => {
      return paramsParent.value.disabledActionGrid
        ? paramsParent.value.disabledActionGrid
        : false;
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

    function handleDuplicate() {
      paramsParent.value.handleDuplicate(props.params.data);
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
      disabledActionGrid,
      handleMenu,
      handleEdit,
      handleDuplicate,
    };
  },
});
</script>
