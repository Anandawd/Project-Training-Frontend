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
import CInput from "@/components/input/input.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";

const resourceAPI = new ConfigurationResource("ItemUOM");

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
})
export default class Breakdown extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public code: string = null;
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  focus: boolean = false;
  uomName: any = [];
  selectedCode: any = {};
  deleteCode: any = "";
  listDropdown: any = {};
  searchOptions: any = [];
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

  resetForm() {
    this.formElement.resetForm();
    this.$nextTick();
    this.form = {
      purchase_price: 0,
      sell_price: 0,
      item_code: this.code,
    };
  }

  refreshData() {
    this.loadData();
  }

  async initialize(code: string) {
    this.code = code;
    this.loadData();
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // async onChangeUom(event: any){
  //   await this.loadDropdown();
  //   const code = event.target.value;
  //   this.setUomName(code)
  //   this.form.Name = this.form.DataName
  //   console.log(this.form.DataName);
  // }

  // setUomName(code: any){
  //   for (const i in this.listDropdown) {
  //     if (this.listDropdown[i].code == code) {
  //       this.selectedCode = i;
  //       this.form.DataName = this.listDropdown[i].code ;
  //       console.log(this.listDropdown);
  //     }
  //   }
  // }

  async handleShowForm(params: any, mode: any) {
    await this.$nextTick(() => {
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
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
  }

  async handleSave() {
    this.isSaving = true;
    this.form.purchase_price = parseFloat(this.form.purchase_price);
    this.form.sell_price = parseFloat(this.form.sell_price);
    this.form.quantity = parseFloat(this.form.quantity);
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(this.form);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(this.form);
    }
    this.isSaving = false;
    this.handleCloseForm();
  }

  handleCloseForm() {
    this.showForm = false;
    this.$emit("closingform");
  }

  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown");
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData() {
    const selectedRow = this.gridApi.getSelectedRows();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    try {
      const { data } = await resourceAPI.detailDataList("Item", this.code);
      this.rowData = data.ItemUOM;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "id", rowNodes);
    } catch (error) {}
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
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(form: any) {
    try {
      const { status2 } = await resourceAPI.update(form);
      if (status2.status == 0) {
        this.$emit("save");
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(form: any) {
    try {
      const { status2 } = await resourceAPI.create(form);
      if (status2.status == 0) {
        this.$emit("save");
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadDropdown() {
    try {
      const { data } = await resourceAPI.codeNameList("UOM");
      this.listDropdown = data;
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
        headerName: this.$t("commons.table.uom"),
        field: "name",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 100,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.purchasePrice"),
        field: "purchase_price",
        width: 120,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.sellPrice"),
        field: "sell_price",
        width: 100,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.barcode"),
        field: "barcode",
        width: 100,
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
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  //Validation
  get schema() {
    return Yup.object().shape({
      UOM: Yup.string().required(),
      Quantity: Yup.number().required(),
      "Purchase Price": Yup.number(),
      "Sell Price": Yup.number(),
      // purchase_price: Yup.number().test((val) => {
      //   return val >= 0 && val < this.form.sell_price;
      // }),
      // sell_price: Yup.number().test((val) => {
      //   return val > 0 && val > this.form.purchase_price;
      // }),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.multiUom")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.multiUom")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.multiUom")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
