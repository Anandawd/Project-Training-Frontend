import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import checklistVue from "@/components/ag_grid-framework/checklist.vue";
import $global from "@/utils/global";
import { reactive, ref } from "vue";
import CDialog from "@/components/dialog/dialog.vue";
import * as Yup from "yup";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import InputForm from "./components/input-form/input-form.vue";
import NotifTpTemplateAPI from "@/services/api/configuration/notif-tp-template";
import { formatDateTime, formatNumber } from "@/utils/format";
import { getToastSuccess } from "@/utils/toast";
const notifTpTemplateAPI = new NotifTpTemplateAPI();

@Options({
  components: {
    AgGridVue,
    InputForm,
    SearchFilter,
    CDialog,
  },
})
export default class Blank extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public showForm: boolean = false;
  public modeData: any = 0;
  public showDialog: boolean = false;
  public isSave: boolean;
  public inputFormElement: any = ref();
  public parentId: any;
  isSaving: boolean = false;
  deleteId: number;
  searchDefault: any = {
    index: 0,
    text: "",
  };
  searchOptions: any = [];

  // Ag grid variable
  detailRowAutoHeight: boolean = true;
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
  folioNumber: any;
  global: any;
  refresh: any;

  // GENERAL FUNCTION ================================================================
  async refreshData() {
    await this.loadData();
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result = [
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingDataSendReminder"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        // action: () => this.handleTrackingData(this.$global.tableName.invCosting, this.paramsData.id),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.index_id == vm.paramsData.index_id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  handleTrackingData(tableName: number, id: number) {
    // const trackingData = trackingDataModule();
    // trackingData.show(tableName, id);
  }

  async handleEdit(params: any) {
    this.inputFormElement.initialize();
    await this.editData(params.id);
    this.modeData = $global.modeData.edit;
    this.showForm = true;
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    await this.updateData(formData);
    this.isSaving = false;
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(search: any = this.searchDefault) {
    const selectedRow = this.gridApi.getSelectedRows();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        TypeCode: "E",
      };
      const { data } = await notifTpTemplateAPI.GetNotifThirdPartyTemplateList(
        params
      );
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {}
  }

  async editData(id: any) {
    try {
      const { data } = await notifTpTemplateAPI.GetNotifThirdPartyTemplate(id);
      this.inputFormElement.onEdit(data);
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await notifTpTemplateAPI.UpdateNotifTpTemplate(
        formData
      );
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.id"), value: 0 },
      { text: this.$t("commons.filter.subject"), value: 1 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        insert: false,
        correction: false,
        void: false,
        delete: false,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "number",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 60,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center-suppress-menu",
      },
      {
        headerName: this.$t("commons.table.id"),
        field: "id",
        width: 60,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.eventCode"),
        field: "EventCode",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.subject"),
        field: "subject",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.message"),
        field: "message",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.formatType"),
        field: "FormatType",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.typeCode"),
        field: "type_code",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 120,
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
        width: 100,
      },
    ];

    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklist: checklistVue,
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
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Id: Yup.string().required(),
      Event: Yup.string().required(),
      Type: Yup.string().required(),
      Format: Yup.string().required(),
      Subject: Yup.string().required(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
