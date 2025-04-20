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
import CSelect from "@/components/select/select.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import { Form } from "vee-validate";
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
// import CDialog from "@/components/modal/modal.vue";
const resourceAPI = new ConfigurationResource("PackageBusinessSource");

@Options({
  components: {
    Form,
    CCheckbox,
    CDialog,
    CSelect,
    CInput,
    AgGridVue,
    SearchFilter,
  },
  props: {
    isSaving: {
      type: Boolean,
    },
  },
})
export default class BusinessSource extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public code: string;
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public isSave: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  focus: boolean = false;
  Account: any = [];
  deleteCode: any = "";
  searchDefault: {
    index: number;
    text: string;
  } = null;
  listDropdown = {};
  searchOptions: any = [];
  columnOptions = [
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
      width: "150",
      filter: true,
    },
  ];
  isSaving: boolean;

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
  selectedCode: any = {};
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
        action: () => this.trackingData(this.paramsData),
      },
    ];
    return result;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }

  handleClose() {
    this.showForm = false;
    this.$emit("hideButton");
  }

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      account_code: "",
      commission_type_code: "",
      commission_value: 0,
      company_code: "",
      package_code: this.code,
    };
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  initialize(code: string) {
    this.code = code;
    this.loadData();
  }

  onChangeAccount(event: any) {
    const code = event.target.value;
    this.setAccountData(code);
  }

  setAccountData(code: number) {
    this.form.account = "";
    for (const i of this.Account) {
      if (i.code == code) {
        this.selectedCode = i;
        this.form.account = i.name;
      }
    }
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  async handleShowForm(params: any, mode: any) {
    await this.$nextTick(() => {
      this.code;
      this.resetForm();
      this.loadDropdown();
      this.modeData = mode;
      this.showForm = true;
    });
    setInputFocus();
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
  }

  async handleEdit(params: any) {
    await this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.id);
    this.setAccountData(this.form.account_code);
  }

  async handleDuplicate(params: any) {
    await this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
    this.setAccountData(this.form.account_code);
  }

  handleSave() {
    this.form.commission_value = parseFloat(this.form.commission_value);
    if (this.modeData == $global.modeData.insert) {
      this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(this.form);
    } else if (this.modeData == $global.modeData.duplicate) {
      this.insertData(this.form);
    }
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(search: any = this.searchDefault) {
    try {
      const { data } = await resourceAPI.detailDataList("Package", this.code);
      this.rowData = data.PackageBusinessSource;
    } catch (error) {}
  }

  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        data = data.data;
      } else {
        return;
      }
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.showForm = false;
        this.$emit("save");
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
        this.showForm = false;
        this.$emit("saveBusiness");
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const { data } = await resourceAPI.codeNameListArray([
        "Account",
        "BusinessSource",
        "CommissionType",
      ]);
      this.listDropdown = data;
      this.Account = data.Account;
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
      index: 1,
      text: "",
    };
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.type"), value: 2 },
      { text: this.$t("commons.filter.createdBy"), value: 3 },
      { text: this.$t("commons.filter.updatedBy"), value: 4 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        duplicate: true,
        delete: true,
        edit: true,
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
        field: "id",
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
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.commissionType"),
        field: "CommissionTypeName",
        width: 190,
      },
      {
        headerName: this.$t("commons.table.company"),
        field: "CompanyName",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.commissionValue"),
        field: "commission_value",
        width: 130,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
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
      iconLockRenderer: IconLockRenderer,
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

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================

  //Validation
  get schema() {
    return Yup.object().shape({
      Account: Yup.string().required(),
      "Business Source": Yup.string().required(),
      "Commission Type": Yup.string().required(),
      "Commission Value": Yup.number().required(),
    });
  }
  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.businessSourceAndAP")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.businessSourceAndAP")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.businessSourceAndAP")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
