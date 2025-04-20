import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
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
import ProductDiscount from "@/views/pages/modules/general/tools/configurations/components/product-discount-grid/product-discount/product-discount.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
const resourceAPI = new ConfigurationResource("PackageBreakdown");
const resourceAPIMember = new ConfigurationResource("MemberOutletDiscount");

@Options({
  components: {
    Form,
    CCheckbox,
    CDialog,
    CSelect,
    CInput,
    AgGridVue,
    SearchFilter,
    ProductDiscount,
  },
})
export default class Breakdown extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public code: string = null;
  public formElement: any = ref();
  public productDiscountFormElement: any = ref();
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
  listDropdown = {};
  searchOptions: any = [];
  // Ag grid variable
  gridOptions: any = {};
  columnDefs: any;
  columnDefsDiscount: any;
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
        action: () => this.handleInsert(this.paramsData),
      },
    ];
    return result;
  }
  // TODO: untuk load combolist pada input form product
  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdownList");
  }

  onChangeCategory(event: any) {
    this.loadDataProduct();
  }

  onChangeProduct(event: any) {
    this.loadDataProduct();
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
    this.form = {};
  }

  refreshData() {
    this.loadDataProduct();
  }

  async initialize(code: string) {
    this.code = code;
    this.form.outlet_code = code;
    this.form.category_code = "";
    this.form.product = "";
    await this.loadDataProduct();
  }

  handleInsert(data: any) {
    this.$emit("handleInsert", data);
  }

  async resetComp() {
    this.code = "";
    this.form.outlet_code = "";
    this.form.category_code = "";
    this.form.product = "";
    this.rowData = null;
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangePerPax() {
    this.form.max_pax = 1;
    if (this.form.per_pax) {
      this.form.max_pax = 1000;
      this.form.quantity = 1;
    }
  }

  handleShowForm(params: any, mode: any) {
    this.resetForm();
    this.loadDropdown();
    this.modeData = mode;
    this.showForm = true;
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.id;
  }

  async handleEdit(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.edit;
    await this.editData(params.id);
  }

  async handleDuplicate(params: any) {
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.id);
  }

  handleSave() {
    this.form.amount = parseFloat(this.form.amount);
    this.form.quantity = parseFloat(this.form.quantity);
    this.form.extra_pax = parseFloat(this.form.extra_pax);
    this.form.max_pax = parseFloat(this.form.max_pax);
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
  async loadDataProduct() {
    this.gridApi.showLoadingOverlay();
    const params = {
      OutletCode: this.form.outlet_code ?? "",
      CategoryCode: this.form.category_code ?? "",
      ProductText: this.form.product ?? "",
    };
    try {
      const { data } = await resourceAPI.GetMemberProduct(params);
      this.rowData = data;
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
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(form: any) {
    try {
      const { status2 } = await resourceAPI.update(form);
      if (status2.status == 0) {
        this.loadDataProduct();
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
        this.loadDataProduct();
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
        "SubDepartment",
        "Account",
        "BusinessSource",
        "TaxAndService",
        "ChargeFrequency",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadDataProduct();
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
        insert: true,
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
        lockPosition: true,
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 80,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.code"),
        field: "Code",
        width: 80,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "Product",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.category"),
        field: "Category",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.group"),
        field: "GroupX",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "Price",
        width: 120,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
         valueFormatter:  formatNumber,
        filterParams: {
          valueFormatter:  formatNumber,
        },
      },
      // {
      //   headerName: this.$t("commons.table.createdAt"),
      //   field: "created_at",
      //   width: 120,
      //    valueFormatter:  formatDateTime,
        // filterParams: {
        //   valueFormatter:  formatDateTime,
        // },
      //   cellStyle: { textAlign: "center" },
      //   headerClass: "align-header-center",
      // },
      // {
      //   headerName: this.$t("commons.table.createdBy"),
      //   field: "created_by",
      //   width: 100,
      // },
      // {
      //   headerName: this.$t("commons.table.updatedAt"),
      //   field: "updated_at",
      //   width: 120,
      //    valueFormatter:  formatDateTime,
        // filterParams: {
        //   valueFormatter:  formatDateTime,
        // },
      //   cellStyle: { textAlign: "center" },
      //   headerClass: "align-header-center ",
      // },
      // {
      //   headerName: this.$t("commons.table.updatedBy"),
      //   field: "updated_by",
      //   width: 100,
      // },
    ];
    this.columnDefsDiscount = [
      {
        headerName: this.$t("commons.table.outlet"),
        field: "code",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "product",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "category",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.discountMember"),
        field: "OutletName",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
         valueFormatter:  formatDateTime,
        filterParams: {
          valueFormatter:  formatDateTime,
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
         valueFormatter:  formatDateTime,
        filterParams: {
          valueFormatter:  formatDateTime,
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
      "Sub Department": Yup.string().required(),
      Account: Yup.string().required(),
      Quantity: Yup.number().required().min(1),
      Amount: Yup.number().required().min(1),
      "Charge Frequency": Yup.string().required(),
      "Tax & Service": Yup.string().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.breakdown")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
