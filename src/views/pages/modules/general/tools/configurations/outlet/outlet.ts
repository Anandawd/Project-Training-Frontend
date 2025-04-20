import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import Select from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import InputForm from "../components/input-form/input-form.vue";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import { formatDateTime } from "@/utils/format";
import * as Yup from "yup";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import trackingDataModule from "@/stores/tracking-data";
const resourceAPI = new ConfigurationResource("Outlet");

@Options({
  components: {
    CDialog,
    InputForm,
    Select,
    CInput,
    AgGridVue,
    SearchFilter,
  },
})
export default class Outlet extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public inputFormElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  searchOptions: any = [];
  Account: any = [];
  selectedSubGroupCode: any = [];
  columnOptionsAccount = [
    {
      label: "code",
      field: "code",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "name",
      field: "name",
      align: "left",
      width: "120",
      filter: true,
    },
  ];
  isSaving: boolean = false;
  public uploadURL: string;
  // Ag grid variable
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
  // GENERAL FUNCTION ================================================================

  onGridReady() {
    //
  }

  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  // ------------------------additional for context menu ag-Grid-----------//

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
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        action: () => this.handleDuplicate(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () =>
          this.handleTrackingData(
            this.$global.tableName.posCfgInitOutlet,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
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

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  async successUploadImage(code: any) {
    await this.editData(code);
  }

  async onChangeAccount(event: any) {
    const code = event.target.value;
    await this.setAccountSubGroup(code);
    this.inputFormElement.isDisable =
      this.selectedSubGroupCode === "ACPY" ? false : true;
  }

  setAccountSubGroup(code: number) {
    this.loadDropdownAccountCharge();
    for (const i of this.Account) {
      if (i.code == code) {
        this.selectedSubGroupCode = i.sub_group_code;
      }
    }
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  resetData() {
    this.form = {
      id_sort: 0,
      is_active: 1,
    };
  }

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  handleShowForm(params: any, mode: any) {
    this.loadDropdown();
    this.loadDropdownAccountCharge();
    this.resetData();
    this.inputFormElement.initialize();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    this.uploadURL =
      import.meta.env.VITE_APP_URL_API +
      "/upload/UploadImageOutlet/" +
      params.code;

    this.loadDropdown();
    this.loadDropdownAccountCharge();
    this.modeData = $global.modeData.edit;
    await this.editData(params.code);
  }
  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.loadDropdownAccountCharge();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.code);
  }

  async handleSave(formData: any) {
    formData.id_sort = parseInt(formData.id_sort);
    formData.is_for_iptv = parseInt(formData.is_for_iptv);
    formData.is_active = parseInt(formData.is_active);
    formData.is_check_available_table = parseInt(
      formData.is_check_available_table
    );
    formData.commission_percent = parseFloat(formData.commission_percent);
    this.isSaving = true;
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(formData);
    }
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
    this.gridApi.showLoadingOverlay();
    try {
      let params = {
        Index: search.index,
        Text: search.text,
      };
      const { data } = await resourceAPI.list(params);
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.inputFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.inputFormElement.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      formData.code = this.form.code;
      // formData.is_system = false
      formData.id_sort = parseInt(formData.id_sort);
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await resourceAPI.create(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const params = [
        "Department",
        "Store",
        "TaxAndService",
        "SubDepartment",
        "BusinessSource",
        "CommissionType",
        "Printer",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.inputFormElement.listDropdown.global = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdownAccountCharge() {
    try {
      const { data } = await resourceAPI.getAccountCharges();
      this.inputFormElement.listDropdown.accountCharge = data;
      this.Account = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchDefault = {
      index: 0,
      text: "",
    };

    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.checkPrefix"), value: 2 },
      { text: this.$t("commons.filter.subDepartment"), value: 3 },
      { text: this.$t("commons.filter.store"), value: 4 },
      { text: this.$t("commons.filter.taxAndService"), value: 5 },
      { text: this.$t("commons.filter.createdBy"), value: 6 },
      { text: this.$t("commons.filter.updatedBy"), value: 7 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      { headerName: this.$t("commons.table.code"), field: "code", width: 80 },
      { headerName: this.$t("commons.table.name"), field: "name", width: 120 },
      {
        headerName: this.$t("commons.table.checkPrefix"),
        field: "check_prefix",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "DepartmentName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.store"),
        field: "StoreName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.taxAndService"),
        field: "TaxAndServiceName",
        width: 270,
      },
      {
        headerName: this.$t("commons.table.idSort"),
        field: "id_sort",
        width: 70,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.forIpTv"),
        field: "is_for_iptv",
        width: 80,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.active"),
        field: "is_active",
        width: 80,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.image"),
        field: "image_link",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
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

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklist: Checklist,
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
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Name: Yup.string().required().max(100),
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required()
        .max(10),
      "Check Prefix": Yup.string().required().max(3),
      "Sub Department": Yup.string().required(),
      Store: Yup.string().required(),
      "Tax And Service": Yup.string().required(),
      "Tax And Service Special": Yup.string().required(),
      "Printer Special Item Food": Yup.string().required(),
      "ID Sort": Yup.number(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
