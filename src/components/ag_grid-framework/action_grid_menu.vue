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
    };
  },
});
</script>
