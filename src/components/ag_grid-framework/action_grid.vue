<template>
  <div v-if="params.node.rowPinned">
    <b>{{
      params.colDef.textTotal ? params.colDef.textTotal : $t("labels.total")
    }}</b>
  </div>
  <div
    v-else-if="actionGrid && params.data && !params.node.rowPinned"
    class="d-flex action-button justify-content-center"
  >
    <c-dropdown v-if="actionGrid.menuDropdown" is-action-grid>
      <template v-slot:dropdown-button>
        <i
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          :title="$t('tooltips.menu')"
          class="fa fa-bars text-blue"
          aria-hidden="true"
        ></i>
      </template>
      <template v-slot:dropdown-menu>
        <button type="button" class="dropdown-item">
          <img
            border="0"
            :width="iconSize"
            :height="iconSize"
            src="/images/icons/tracking_icon24.png"
          />{{ $t("commons.menu.trackingData") }}
        </button>
      </template>
    </c-dropdown>
    <button
      v-if="actionGrid.menu"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      style="margin-top: 0.5px"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="$t('tooltips.menu')"
      @click="handleMenu"
    >
      <i class="fa fa-bars text-blue" aria-hidden="true"></i>
    </button>
    <button
      v-if="actionGrid.insert"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="$t('tooltips.insert')"
      @click="handleInsert"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/add_icon24.png"
      />
    </button>
    <button
      v-if="actionGrid.edit"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="$t('tooltips.edit')"
      @click="handleEdit"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/edit_icon24.png"
      />
    </button>
    <button
      v-if="actionGrid.duplicate"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="$t('tooltips.duplicate')"
      @click="handleDuplicate"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/duplicate_icon24.png"
      />
    </button>
    <button
      v-if="actionGrid.delete"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="$t('tooltips.delete')"
      @click="handleDelete"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/delete_icon24.png"
      />
    </button>
    <button
      v-if="actionGrid.correction"
      type="button"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="$t('tooltips.correction')"
      @click="handleCorrectionVoid(true)"
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
      v-if="actionGrid.void"
      type="button"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="$t('tooltips.void')"
      @click="handleCorrectionVoid(false)"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/delete_icon24.png"
      />
    </button>
    <div
      v-if="
        actionGrid.insertDetail1 ||
        actionGrid.insertDetail2 ||
        actionGrid.insertDetail3 ||
        actionGrid.insertDetail4 ||
        actionGrid.insertDetailGroup
      "
      class="action-grid-separator"
    >
      <span></span>
    </div>
    <button
      v-if="actionGrid.insertDetail1"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="actionGrid.insertDetail1.title ?? $t('tooltips.insert')"
      @click="handleInsertDetail1"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/add_icon24.png"
      />
    </button>
    <button
      v-if="actionGrid.insertDetail2"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="actionGrid.insertDetail2.title ?? $t('tooltips.insert')"
      @click="handleInsertDetail2"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/add_icon24.png"
      />
    </button>
    <button
      v-if="actionGrid.insertDetail3"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="actionGrid.insertDetail3.title ?? $t('tooltips.insert')"
      @click="handleInsertDetail3"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/add_icon24.png"
      />
    </button>
    <button
      v-if="actionGrid.insertDetail4"
      type="button"
      :disabled="disabledActionGrid"
      class="btn btn-flat btn-action-grid"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      :title="actionGrid.insertDetail4.title ?? $t('tooltips.insert')"
      @click="handleInsertDetail4"
    >
      <img
        border="0"
        :width="iconSize"
        :height="iconSize"
        src="/images/icons/add_icon24.png"
      />
    </button>
    <div
      v-if="actionGrid.insertDetailGroup"
      class="btn-group"
      role="group"
      aria-label="Button group with nested dropdown"
    >
      <div class="btn-group" role="group">
        <button
          type="button"
          :disabled="disabledActionGrid || disableButtonGroup"
          class="btn btn-flat btn-action-grid"
          data-bs-toggle="dropdown"
          data-bs-placement="top"
          aria-expanded="false"
          :title="actionGrid.insertDetailGroup.title"
          @click="clickButtonGroup"
        >
          <img
            border="0"
            :width="iconSize"
            :height="iconSize"
            src="/images/icons/add_icon24.png"
          />
        </button>
        <ul
          :hidden="hideDropdown || disabledActionGrid"
          class="dropdown-menu"
          aria-labelledby="btnGroupDrop1"
        >
          <li v-for="item in commonDataArr" :key="item">
            <a
              @click="handleInsertDetailGroup(item.code)"
              class="dropdown-item"
              >{{ item.title }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { BDropdown, BDropdownItem } from "bootstrap-vue-3";
import configStore from "../../stores/config";
import CDropdown from "@/components/dropdown/dropdown.vue";
import global from "@/utils/global";
import { getToastInfo } from "@/utils/toast";
import { formatDateDatabase } from "@/utils/format";

export default defineComponent({
  name: "action_grid",
  components: {
    CDropdown,
    BDropdown,
    BDropdownItem,
  },
  props: ["params"],
  setup(props: any) {
    const config = configStore();
    const actionGrid = computed(() => {
      return props.params.column.gridOptionsWrapper.gridOptions.actionGrid;
    });
    const iconSize = global.iconSize;

    const disableButtonGroup = computed(() => {
      const code = props.params.data.dynamic_rate_type_code;
      if (code) {
        if (code.includes("S") || code.includes("O")) {
          return false;
        } else {
          return true;
        }
      }
    });

    const paramsParent = computed(() => {
      return props.params.context.componentParent;
    });
    const disabledActionGrid = computed(() => {
      return paramsParent.value.disabledActionGrid
        ? paramsParent.value.disabledActionGrid
        : false;
    });

    const hideButtonGroupByCode = computed(() => {
      return paramsParent.value.hideButtonGroupByCode
        ? paramsParent.value.hideButtonGroupByCode
        : [];
    });

    const hideDropdown = computed(() => {
      return paramsParent.value.hideDropdown
        ? paramsParent.value.hideDropdown
        : false;
    });

    const commonDataArr = computed(() => {
      let dataArray =
        props.params.column.gridOptionsWrapper.gridOptions.actionGrid
          .insertDetailGroup;
      let GroupArr = paramsParent.value.hideButtonGroupByCode
        ? paramsParent.value.hideButtonGroupByCode
        : [];
      return dataArray.titleDropdown.filter((item: any) =>
        GroupArr.includes(item.code)
      );
    });

    function handleMenu(event: any) {
      if (props.params.data) {
        try {
          const params = props.params;
          paramsParent.value.handleMenu(params);
          params.api.contextMenuFactory.showMenu(
            params.node,
            params.column,
            params.value,
            event
          );
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }

    function handleEdit() {
      if (props.params.data) {
        try {
          paramsParent.value.handleEdit(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }

    function handleDelete() {
      if (props.params.data) {
        try {
          paramsParent.value.handleDelete(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }

    function handleInsert() {
      if (props.params.data) {
        try {
          paramsParent.value.handleInsert(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }

    function handleInsertDetail1() {
      if (props.params.data) {
        try {
          paramsParent.value.handleInsertDetail1(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }
    function handleInsertDetail2() {
      if (props.params.data) {
        try {
          paramsParent.value.handleInsertDetail2(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }
    function handleInsertDetail3() {
      if (props.params.data) {
        try {
          paramsParent.value.handleInsertDetail3(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }
    function handleInsertDetail4() {
      if (props.params.data) {
        try {
          paramsParent.value.handleInsertDetail4(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }

    function clickButtonGroup() {
      if (props.params.data) {
        try {
          paramsParent.value.clickButtonGroup(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }
    function handleInsertDetailGroup(code: any) {
      if (props.params.data) {
        try {
          paramsParent.value.handleInsertDetailGroup(code, props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }
    function handleDuplicate() {
      if (props.params.data) {
        try {
          paramsParent.value.handleDuplicate(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }
    async function handleCorrectionVoid(isCorrection: any) {
      await config.getAuditDate();
      if (props.params.data) {
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

        try {
          paramsParent.value.handleCorrectionVoid(
            props.params.data,
            isCorrection
          );
        } catch (err) {
          throw new Error("Method not implemented.");
        }
      } else {
        openUndefinedAlert();
      }
    }

    function showPopUp(modeData: any) {
      if (props.params.data !== undefined) {
        try {
          paramsParent.value.showPopUp(props.params.data);
        } catch (err) {
          throw new Error("Method not implemented.");
        }
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
      disableButtonGroup,
      disabledActionGrid,
      hideButtonGroupByCode,
      actionGrid,
      hideDropdown,
      commonDataArr,
      handleCorrectionVoid,
      handleInsert,
      handleInsertDetail1,
      handleInsertDetail2,
      handleInsertDetail3,
      handleInsertDetail4,
      handleInsertDetailGroup,
      clickButtonGroup,
      handleDuplicate,
      handleMenu,
      handleEdit,
      handleDelete,
    };
  },
});
</script>
<style lang="scss" scoped>
.action-grid-separator > *::after {
  content: "";
  /* if line image is used, this is not necessary */
  background: rgb(204, 203, 203);
  /* if line image is used, this is not necessary */
  display: inline-block;
  width: 1px;
  height: 85%;
  vertical-align: middle;
  margin: 0 2px;
}
</style>
