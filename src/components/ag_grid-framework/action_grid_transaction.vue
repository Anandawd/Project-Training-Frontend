<template>
  <div v-if="params.value === 'Total'">
    {{ params.value }}
  </div>
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
      <b-dropdown-item
        v-if="paramsParent.folioNumber"
        @click="handleProperties()"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/properties_icon24.png"
        />{{ $t("transaction.menu.properties") }}
      </b-dropdown-item>
      <b-dropdown-item
        :disabled="!paramsParent.userAccess.updateSubDepartment"
        @click="handleUpdateType(1)"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/edit_icon24.png"
        />{{ $t("transaction.menu.updateSubDepartment") }}</b-dropdown-item
      >
      <b-dropdown-item
        :disabled="!paramsParent.userAccess.updateRemark"
        @click="handleUpdateType(2)"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/edit_icon24.png"
        />{{ $t("transaction.menu.updateRemark") }}</b-dropdown-item
      >
      <b-dropdown-item
        :disabled="!paramsParent.userAccess.updateDocumentNumber"
        @click="handleUpdateType(3)"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/edit_icon24.png"
        />{{ $t("transaction.menu.updateDocumentNumber") }}</b-dropdown-item
      >
      <b-dropdown-item
        v-if="paramsParent.folioNumber"
        @click="handleUpdateType(4)"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/edit_icon24.png"
        />{{
          $t("transaction.menu.updateDirectBillOrCompany")
        }}</b-dropdown-item
      >
      <b-dropdown-item @click="handlePrint()"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/print_icon24.png"
        />{{ $t("transaction.menu.printReceipt") }}</b-dropdown-item
      >
      <b-dropdown-item @click="handleMenu(global.modeData.tracking)"
        ><img
          border="0"
          :width="iconSize"
          :height="iconSize"
          src="/images/icons/tracking_icon24.png"
        />{{ $t("commons.menu.trackingData") }}
      </b-dropdown-item>
    </b-dropdown>
    <!-- //TODO add user access  -->
    <!-- :disabled="!paramsParent.userAccess.correction" -->
    <button
      type="button"
      class="btn btn-flat"
      @click="handleCorrectionVoid(true)"
      style="margin-top: -5px"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/correction_icon24.png"
      />
    </button>

    <!-- :disabled="!paramsParent.userAccess.void" -->
    <button
      type="button"
      class="btn btn-flat"
      @click="handleCorrectionVoid(false)"
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
import { BDropdown, BDropdownItem } from "bootstrap-vue-3";
import global from "@/utils/global";
import { defineComponent, computed } from "vue";
import { getToastInfo } from "@/utils/toast";
import configStore from "../../stores/config";
import { getServerDate } from "@/utils/general";
import { formatDateDatabase } from "@/utils/format";

export default defineComponent({
  name: "action_grid_transaction",
  components: {
    BDropdown,
    BDropdownItem,
  },
  props: ["params"],
  setup(props: any) {
    const iconSize = 16;
    const config = configStore();
    function handleMenu(modeData: any) {
      if (props.params.data !== undefined) {
        paramsParent.value.onShowMenu(props.params.data, modeData);
      } else {
        openUndefinedAlert();
      }
    }

    function handlePrint() {
      if (props.params.data !== undefined) {
        paramsParent.value.handlePrintReceipt(props.params.data);
      } else {
        openUndefinedAlert();
      }
    }

    function handleUpdateType(type: any) {
      if (props.params.data !== undefined) {
        paramsParent.value.handleUpdateType(props.params.data, type);
      } else {
        openUndefinedAlert();
      }
    }

    function handleProperties() {
      if (props.params.data !== undefined) {
        paramsParent.value.handleShowProperties(props.params.data.id_log);
      } else {
        openUndefinedAlert();
      }
    }

    function openUndefinedAlert() {
      alert("Error");
    }

    async function handleCorrectionVoid(isCorrection: any) {
      await config.getAuditDate();
      if (props.params.data !== undefined) {
        if (props.params.data.void) {
          return getToastInfo("This transaction is already voided!");
        }
        if (
          formatDateDatabase(config.auditDate) ==
          formatDateDatabase(props.params.data.audit_date)
        ) {
          if (isCorrection)
            //TODO add transalate to this
            return getToastInfo("Cannot correction this transaction.");
        } else {
          if (!isCorrection)
            return getToastInfo("Cannot void this transaction.");
        }
        paramsParent.value.handleCorrectionVoid(
          props.params.data,
          isCorrection
        );
      } else {
        openUndefinedAlert();
      }
    }

    const paramsParent = computed(() => {
      return props.params.context.componentParent;
    });

    return {
      paramsParent,
      global,
      iconSize,
      handleCorrectionVoid,
      handleProperties,
      handleUpdateType,
      handlePrint,
      handleMenu,
    };
  },
});
</script>
