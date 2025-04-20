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
import { getToastSuccess, getToastError, getToastInfo } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { formatDateTime, formatNumber } from "@/utils/format";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
const resourceAPI = new ConfigurationResource("MemberOutletDiscountDetail");
const resourceDetailAPI = new ConfigurationResource("MemberOutletDiscount");

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
  public id: string = null;
  public code: string = null;
  public outlet_code: string = null;
  public formElement: any = ref();
  public showForm: boolean = false;
  public showDialog: boolean = false;
  public showDialogEdit: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  public formDiscount: any = 0;
  public formEdit: any = reactive({});
  public dropedData: any;
  public isSaving: boolean = false;
  public showDialogDelete: boolean = false;
  deleteCode: any = "";
  searchDefault: any = {
    index: 1,
    text: "",
  };
  listDropdown = {};
  searchOptions: any = [];
  codeProduct: any;
  // Ag grid variable
  gridOptions: any = {};
  detailRowAutoHeight: boolean = true;
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
      // {
      //   name: this.$t("commons.contextMenu.insert"),
      //   icon: generateIconContextMenuAgGrid("add_icon24"),
      //   action: () => this.handleShowForm("", $global.modeData.insert),
      // },
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
    ];
    return result;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  gridDrop(data: any, grid: any) {
    this.showDialog = true;
    this.dropedData = data;
  }

  async handleSaveDiscount() {
    if (this.formDiscount != null && this.formDiscount != 0) {
      let params: any = {
        product_code: this.dropedData.Code,
        member_code: this.code,
        outlet_code: this.outlet_code,
        discount: this.formDiscount,
      };
      await this.insertData(params);
    } else {
      getToastError(this.$t("messages.inputRequiredAndNotZero"));
    }
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

  resetForm() {
    this.formElement.resetForm();
    this.$nextTick();
    this.form = {
      account_code: "",
      amount: 0,
      charge_frequency_code: "1",
      company_code: "",
      extra_pax: 0,
      include_child: 0,
      is_amount_percent: 1,
      max_pax: 1,
      outlet_code: "",
      package_code: this.code,
      per_pax: 0,
      per_pax_extra: 0,
      product_code: "",
      quantity: 1,
      remark: "",
      sub_department_code: "",
      tax_and_service_code: "",
    };
  }

  refreshData() {
    this.loadData();
  }

  initialize(code: string, outlet_code: string) {
    this.code = code;
    this.outlet_code = outlet_code;
    this.loadData();
  }

  async resetComp() {
    this.dropedData = null;
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
    this.showDialogDelete = true;
    this.deleteCode = params.id;
  }

  async handleEdit(params: any) {
    this.editData(params.id);
    this.modeData = $global.modeData.edit;
  }

  handleSave() {
    this.formDiscount = parseFloat(this.formDiscount);
    if (this.modeData == $global.modeData.insert) {
      this.insertData(this.form);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData();
    } else if (this.modeData == $global.modeData.duplicate) {
      this.insertData(this.form);
    }
  }

  async repeatLoadDropdownList() {
    await this.loadDropdown();
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(code: any = this.code) {
    this.gridApi.showLoadingOverlay();
    const url = "MemberOutletDiscount";
    try {
      const { data } = await resourceAPI.detailDataList(url, code);
      this.rowData = data.MemberOutletDiscountDetail;
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async editData(id: any) {
    try {
      let { data } = await resourceAPI.edit(id);
      if (data) {
        this.inputFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.loadDropdown();
      this.showDialogEdit = true;
      this.formEdit.product_code = data.product_code;
      this.formEdit.discount = data.discount_percent;
    } catch (error) {
      getError(error);
    }
  }

  async updateData() {
    this.isSaving = true;
    let param: any = {
      product_code: this.formEdit.product_code,
      member_outlet_discount_code: this.code,
      outlet_code: this.outlet_code,
      discount_percent: this.formEdit.discount,
    };
    try {
      const { status2 } = await resourceAPI.create(param);
      if (status2.status == 0) {
        this.loadData();
        this.showDialogEdit = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.formEdit = {
          product_code: "",
          discount: 0,
        };
      }
    } catch (error) {
      getError(error);
    }
    this.isSaving = false;
  }

  async insertData(params: any) {
    this.isSaving = true;
    try {
      let param: any = {
        product_code: params.product_code,
        member_outlet_discount_code: params.member_code,
        outlet_code: params.outlet_code,
        discount_percent: params.discount,
      };
      const { status2 } = await resourceAPI.create(param);
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.formDiscount = 0;
      }
    } catch (error) {
      getError(error);
    }
    this.isSaving = false;
  }

  async loadDropdown() {
    try {
      const params = ["Product"];
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
        this.loadData();
        this.showDialogDelete = false;
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
        // menu: true,
        // duplicate: true,
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
        headerName: this.$t("commons.table.member_outlet_discount_code"),
        field: "member_outlet_discount_code",
        width: 150,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.outlet_code"),
        field: "outlet_code",
        width: 150,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.product_code"),
        field: "product_code",
        width: 150,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.outlet"),
        field: "OutletName",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "ProductName",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.discount(%)"),
        field: "discount_percent",
        width: 120,
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
    this.detailRowAutoHeight = true;
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
      discount: Yup.number().required().min(1),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$t("title.member")}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$t("title.member")}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$t("title.member")}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
