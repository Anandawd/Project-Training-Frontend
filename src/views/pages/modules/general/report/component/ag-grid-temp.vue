<template>
  <section class="content">
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ $t("title.linenManagement") }}</h3>
        </div>
        <div id="tooltip" class="card-body">
          <ag-grid-vue
            :style="agGridSetting.styleAgGridFrame"
            :class="agGridSetting.themeAgGrid"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :paginationPageSize="paginationPageSize"
            :gridOptions="gridOptions"
            :context="context"
            :frameworkComponents="frameworkComponents"
            :enableCellChangeFlash="true"
            :rowSelection="rowSelection"
            :rowGroupPanelShow="rowGroupPanelShow"
            :defaultColDef="agGridSetting.defColDef"
            :masterDetail="true"
            :detailCellRenderer="detailCellRenderer"
            :detailRowAutoHeight="detailRowAutoHeight"
            :suppressMakeColumnVisibleAfterUnGroup="true"
            :statusBar="statusBar"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import { Options, Vue } from "vue-class-component";
import $global from "@/utils/global";
import { ref } from "vue";
import { formatDateTime, formatNumber } from "@/utils/format";

@Options({
  components: {
    AgGridVue,
  },
})
export default class agGridTemp extends Vue {
  //Local Variable
  public rowData: any = [];
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
  detailCellRenderer: any;
  gridOptions: any = {};
  columnDefs: any;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any;

  // GENERAL FUNCTION ================================================================

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  mounted() {
    // this.loadDataGrid(this.searchDefault)
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }

  beforeMount() {
    // this.searchOptions = [
    //     { text: this.$t("commons.filter.code"), value: 0 },
    //     { text: this.$t("commons.filter.barcode"), value: 1 },
    //     { text: this.$t("commons.filter.item"), value: 2 },
    //     { text: this.$t("commons.filter.detailName"), value: 3 },
    //     { text: this.$t("commons.filter.location"), value: 4 },
    //     { text: this.$t("commons.filter.receiveNumber"), value: 5 },
    //     { text: this.$t("commons.filter.depreciationType"), value: 6 },
    //     { text: this.$t("commons.filter.receiveId"), value: 7 },
    //     { text: this.$t("commons.filter.sortNumber"), value: 8 },
    //     { text: this.$t("commons.filter.serialNumber"), value: 9 },
    //     { text: this.$t("commons.filter.manufacture"), value: 10 },
    //     { text: this.$t("commons.filter.trademark"), value: 11 },
    //     { text: this.$t("commons.filter.refNumber"), value: 12 },
    //     { text: this.$t("commons.filter.remark"), value: 13 },
    //     { text: this.$t("commons.filter.createdBy"), value: 14 }
    // ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      actionGrid: {
        menu: true,
        insert: true,
        update: true,
        delete: true,
        duplicate: true,
      },
    };
    this.columnDefs = [
      // { headerName: this.$t('commons.table.action'), field: 'code', enableRowGroup: false, resizable: false, filter: false, suppressMenu: true, suppressMoveable: true, lockPosition: 'left', sortable: false, cellRenderer: 'actionGrid', colId: 'params', width: 110, cellStyle: { textAlign: 'center' }, headerClass: "align-header-center " },
      { headerName: this.$t("commons.table.code"), field: "code", width: 140 },
      {
        headerName: this.$t("commons.table.barcode"),
        field: "barcode",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.item"),
        field: "item_name",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.detailName"),
        field: "remark",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.location"),
        field: "location_name",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.receiveNumber"),
        field: "receive_number",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.acquisitionDate"),
        field: "acquisition_date",
        width: 140,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.depreciationDate"),
        field: "depreciation_date",
        width: 140,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.depreciationType"),
        field: "depreciation_type_name",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.purchasePrice"),
        field: "purchase_price",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.currentValue"),
        field: "current_value",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.depreciatedValue"),
        field: "depreciated_value",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.residualValue"),
        field: "residual_value",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.usefulLife"),
        field: "useful_life",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.receiveId"),
        field: "receive_id",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.sortNumber"),
        field: "sort_number",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.serialNumber"),
        field: "serial_number",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.manufacture"),
        field: "manufacture_code",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.trademark"),
        field: "trademark",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.warrantyDate"),
        field: "warranty_date",
        width: 140,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.depreciatedRate"),
        field: "depreciation_rate",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.condition"),
        field: "item_condition_name",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.refNumber1"),
        field: "ref_number1",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.refNumber2"),
        field: "ref_number2",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 140,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 140,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 120,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = {
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agTotalRowCountComponent", align: "center" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    };
    this.paginationPageSize = this.agGridSetting.limitDefaultPageSize;
    this.rowSelection = "multiple";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  // get disabledActionGrid() {
  //     return this.showForm
  // }
  // END GETTER AND SETTER FUNCTION ==================================================
}
</script>
<style></style>
