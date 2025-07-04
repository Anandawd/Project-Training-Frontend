import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import CDialog from "@/components/dialog/dialog.vue";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import CSelect from "@/components/select/select.vue";
import FingerprintEnrollmentAPI from "@/services/api/payroll/fingerprint-enrollment/fingerprint-enrollment";
import { formatDateTime2 } from "@/utils/format";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import $global from "@/utils/global";
import { getToastSuccess } from "@/utils/toast";
import CSearchFilter from "@/views/pages/components/filter/filter.vue";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import CInputForm from "./fingerprint-devices-input-form/fingerprint-devices-input-form.vue";

const fingerprintEnrollmentAPI = new FingerprintEnrollmentAPI();

@Options({
  components: {
    AgGridVue,
    CSearchFilter,
    CModal,
    CDialog,
    CSelect,
    CInput,
    CInputForm,
  },
})
export default class FingerprintDevices extends Vue {
  // data
  public rowData: any[] = [];
  public deleteParam: any;

  // ui state
  public isSaving: boolean = false;
  public isLoading: boolean = false;

  // form
  public form: any = {};
  public modeData: any;
  public showForm: boolean = false;
  public inputFormElement: any = ref();

  // Dialog
  public showDialog = false;
  public dialogMessage = "";
  public dialogAction = "";

  // filter
  public searchOptions: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };

  // AG GRID VARIABLE
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
  detailCellRenderer: any;

  // RECYCLE LIFE FUNCTION ===================================================
  created(): void {
    this.loadDataGrid();
  }

  beforeMount(): void {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.updatedBy"), value: 2 },
      {
        text: this.$t("commons.filter.createdBy"),
        value: 3,
      },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        insert: true,
        edit: true,
        delete: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
        field: "id",
        width: 100,
        enableRowGroup: false,
        resizeable: false,
        filter: false,
        suppressMenu: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.deviceId"),
        field: "device_id",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.name"),
        field: "name",
        width: 200,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.employee.placement"),
        field: "Placement",
        width: 150,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.model"),
        field: "model",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.manufacturer"),
        field: "manufacturer",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.ipAddress"),
        field: "ip_address",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.port"),
        field: "port",
        width: 100,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.serialNumber"),
        field: "serial_number",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.firmwareVersion"),
        field: "firmware_version",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.deviceType"),
        field: "device_type ",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.payroll.status"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "status",
        width: 120,
        enableRowGroup: true,
        cellRenderer: (params: any) => {
          const status = params.value;
          let badgeClass = "";
          let statusText = "";

          switch (status) {
            case "ONLINE":
              badgeClass = "bg-success";
              statusText = "ONLINE";
              break;
            case "OFFLINE":
              badgeClass = "bg-secondary";
              statusText = "OFFLINE";
              break;
            case "ERROR":
              badgeClass = "bg-danger";
              statusText = "ERROR";
              break;
            case "MAINTENANCE":
              badgeClass = "bg-warning";
              statusText = "MAINTENANCE";
              break;
            default:
              badgeClass = "bg-secondary";
              statusText = status;
          }
          return `<span class="badge ${badgeClass} py-1 px-3">${statusText}</span>`;
        },
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.maxUsers"),
        field: "max_users",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.enrolledUsers"),
        field: "enrolled_users",
        width: 120,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.lastSync"),
        field: "last_sync",
        width: 150,
        enableRowGroup: false,
      },
      {
        headerName: this.$t("commons.table.payroll.attendance.active"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "is_active",
        width: 80,
        enableRowGroup: true,
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_at",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "updated_by",
        width: 120,
        enableRowGroup: true,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_at",
        width: 120,
        enableRowGroup: true,
        valueFormatter: formatDateTime2,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        headerClass: "align-header-center",
        cellClass: "text-center",
        field: "created_by",
        width: 120,
        enableRowGroup: true,
      },
    ];
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklistRenderer: Checklist,
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

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.ColumnApi = params.columnApi;
  }

  // GENERAL FUNCTION ========================================================
  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }

    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () =>
          this.handleShowForm(this.paramsData, $global.modeData.edit),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
    ];
    return result;
  }

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id == vm.paramsData.id) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  async handleShowForm(params: any, mode: any) {
    this.showForm = false;
    await this.$nextTick();

    this.modeData = mode;
    this.$nextTick(() => {
      if (mode === $global.modeData.insert) {
        this.inputFormElement.initialize();
      } else {
        this.loadEditData(params.id);
      }
    });
    this.showForm = true;
  }

  handleMenu() {}

  handleSave(formData: any) {
    const formattedData = this.formatData(formData);

    if (this.modeData === $global.modeData.insert) {
      this.insertData(formattedData);
    } else {
      this.updateData(formattedData);
    }
  }

  handleInsert() {
    this.handleShowForm("", $global.modeData.insert);
  }

  handleEdit(formData: any) {
    this.handleShowForm(formData, $global.modeData.edit);
  }

  handleDelete(params: any) {
    this.deleteParam = params.id;
    this.dialogMessage = this.$t(
      "messages.attendance.confirm.deleteFingerprintDevice"
    );
    this.dialogAction = "delete";
    this.showDialog = true;
  }

  confirmAction() {
    if (this.dialogAction === "delete") {
      this.deleteData();
    }
    this.showDialog = false;
  }

  refreshData(search: any) {
    this.loadDataGrid(search);
  }

  onRefresh() {
    this.loadDataGrid(this.searchDefault);
  }

  // API REQUEST =======================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
      };
      const { data } = await fingerprintEnrollmentAPI.GetFingerprintDeviceList(
        params
      );
      if (data) {
        this.rowData = data;
      } else {
        this.rowData = [];
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadEditData(id: any) {
    try {
      const { data } = await fingerprintEnrollmentAPI.GetFingerprintDeviceById(
        id
      );
      if (data) {
        this.$nextTick(() => {
          this.inputFormElement.form = this.populateForm(data);
        });
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      this.isSaving = true;
      const { status2 } =
        await fingerprintEnrollmentAPI.InsertFingerprintDevice(formData);
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.attendance.success.saveFingerprintDevice")
        );
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async updateData(formData: any) {
    try {
      this.isSaving = true;
      const { status2 } =
        await fingerprintEnrollmentAPI.UpdateFingerprintDevice(formData);
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.attendance.success.updateFingerprintDevice")
        );
        this.loadDataGrid(this.searchDefault);
        this.showForm = false;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteData() {
    try {
      this.isSaving = true;
      const { status2 } =
        await fingerprintEnrollmentAPI.DeleteFingerprintDevice(
          this.deleteParam
        );
      if (status2.status == 0) {
        getToastSuccess(
          this.$t("messages.attendance.success.deleteFingerprintDevice")
        );
        this.loadDataGrid(this.searchDefault);
        this.deleteParam = null;
      }
    } catch (error) {
      getError(error);
    } finally {
      this.isSaving = false;
    }
  }

  // HELPER =======================================================
  formatData(params: any) {
    return {
      id: params.id,
      device_id: params.device_id,
      placement_code: params.placement_code,
      name: params.name,
      model: params.model,
      manufacturer: params.manufacturer,
      ip_address: params.ip_address,
      port: params.port,
      serial_number: params.serial_number,
      firmware_version: params.firmware_version,
      device_type: params.device_type,
      status: params.status,
      max_users: params.max_users,
      enrolled_users: params.enrolled_users,
      last_sync: params.last_sync,
      settings: params.settings,
      features: params.features,
      is_active: parseInt(params.is_active),
      updated_at: params.updated_at,
      updated_by: params.updated_by,
      created_at: params.created_at,
      created_by: params.created_by,
    };
  }

  populateForm(params: any) {
    return {
      id: params.id,
      device_id: params.device_id,
      placement_code: params.placement_code,
      name: params.name,
      model: params.model,
      manufacturer: params.manufacturer,
      ip_address: params.ip_address,
      port: params.port,
      serial_number: params.serial_number,
      firmware_version: params.firmware_version,
      device_type: params.device_type,
      status: params.status,
      max_users: params.max_users,
      enrolled_users: params.enrolled_users,
      last_sync: params.last_sync,
      settings: params.settings,
      features: params.features,
      is_active: params.is_active,
      updated_at: params.updated_at,
      updated_by: params.updated_by,
      created_at: params.created_at,
      created_by: params.created_by,
    };
  }

  // GETTER AND SETTER =======================================================
  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
