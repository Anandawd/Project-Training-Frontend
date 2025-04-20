import { Options, Vue } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import { getToastSuccess, getToastInfo } from "@/utils/toast";
import { BTabs, BTab } from "bootstrap-vue-3";
import { generateTotalFooterAgGrid, getError } from "@/utils/general";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatDateTimeZeroUTC,
  formatNumber,
} from "@/utils/format";
import { AgGridVue } from "ag-grid-vue3";
import configStore from "@/stores/config";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";

@Options({
  name: "AvailableFieldList",
  components: {
    BTabs,
    BTab,
    Form,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    AgGridVue,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class AvailableFieldList extends Vue {
  inputFormValidation: any = ref();
  inputFormValidationGrid: any = ref();
  modeData: any;
  public config = configStore();
  public defaultForm: any = {};
  public form: any = reactive({});
  public isOther: boolean = true;
  public rowData: any = [];
  public isSave: boolean = false;
  public idGrid: any = 0;
  public idGridEdit: any = 0;
  public account_code: any;
  public totalAmount: any = 0;
  public dataMode: any;
  public dataEdited: any;
  public formData: any = reactive({});
  public qtyConvertion: any;
  public totalFooter: any = [];
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];
  // Dropdown Options
  listDropdown: any = {
    Location: [],
  };
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
  // GENERAL FUNCTION ================================================================
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.rowData = [];
    this.form = {
      portrait_landscape: 0,
      show_footer: 1,
      show_page_number: 1,
      horizontal_border: 1,
      vertical_border: 1,
    };
  }
  async resetForm2() {
    this.inputFormValidationGrid.resetForm();
    this.formData = {};
    this.qtyConvertion = 0;
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSubmitGrid() {
    this.inputFormValidationGrid.$el.requestSubmit();
  }

  onSave() {
    let array: any = [];
    this.rowData.forEach((element: any) => {
      if (element.selected) {
        array.push({
          fa_code: element.fa_code,
          location_code: element.location_code,
        });
      }
    });
    this.form.details = array;
    if (array.length != 0) {
      this.$emit("save", this.form);
      this.rowData = [];
    } else {
      getToastInfo(this.$t("messages.insertItem"));
    }
  }
  onClose() {
    this.$emit("close");
    this.rowData = [];
  }

  handleDoubleClick() {
    this.form.amount = this.totalAmount;
  }

  onInvalidSubmitForm() {
    focusOnInvalid();
  }

  onInvalidSubmitGrid() {
    focusOnInvalid();
  }
  loadStatelist() {}
  getRowNodeId(params: any) {
    return params.id;
  }

  gridFormCancel() {
    this.resetForm2();
    this.isSave = false;
    this.idGridEdit = 0;
  }

  handleEdit(params: any) {
    this.idGridEdit = params.idGrid;
    this.formData.item_data = params.item_code;
    this.formData.quantity = params.quantity;
    this.formData.uom = params.uom_code;
    this.formData.remark = params.remark;
    this.qtyConvertion = params.convertion;
    this.isSave = true;
  }

  handleSaveGrid() {
    if (this.isSave) {
      this.updateDataGrid();
    } else {
      let parameters = {
        item_data: this.formData.item_data,
        quantity: this.formData.quantity,
        uom: this.formData.uom,
        remark: this.formData.remark,
        convertion: this.qtyConvertion,
      };
      this.insertDataGrid(parameters, "");
    }
  }

  handleDelete(params: any) {
    this.$emit("onDelete", params.id);
  }
  countTotalAmount() {
    let tot = 0;
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      tot = tot + parseInt(rowNode.data.Amount);
    });
    this.totalAmount = tot;
  }

  updateDataGrid() {
    // if (this.checkTransactionID()) {
    let data = {
      idGrid: this.idGridEdit,
      item_code: this.formData.item_data,
      quantity: this.formData.quantity,
      uom_item: this.formData.uom,
      remark: this.formData.remark,
      convertion: this.qtyConvertion,
    };
    this.gridApi.applyTransaction({
      update: [data],
    });
    this.isSave = false;
    this.resetForm2();
    this.idGridEdit = 0;
    //   } else {
    //   getToastInfo(this.$t('messages.dataIsAlreadyExist'))
    // }
  }
  insertDataGrid(parameters: any, mode: string) {
    // if (this.form.transaction_id != undefined || mode == "load") {
    //   if (this.checkTransactionID()) {
    let idIncrement = this.idGrid + 1;
    this.idGrid = idIncrement;
    let data = {
      idGrid: idIncrement,
      item_code: parameters.item_data,
      quantity: parameters.quantity,
      uom_code: parameters.uom,
      convertion: parameters.convertion,
      remark: parameters.remark,
    };
    this.gridApi.applyTransaction({
      add: [data],
    });
    this.resetForm2();
    this.countTotalAmount();
    //   } else {
    //     getToastInfo(this.$t('messages.dataIsAlreadyExist'))
    //   }
    // } else {
    //   getToastInfo(this.$t('messages.selectAccount'))
    // }
  }

  checkTransactionID() {
    let trans_id: any;
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      if (rowNode.data.TransactionID == this.form.transaction_id) {
        trans_id = rowNode.data.TransactionID;
      }
    });
    if (trans_id == undefined) {
      return true;
    } else if (this.isSave && this.dataEdited == this.form.transaction_id) {
      this.dataEdited = "";
      return true;
    } else {
      return false;
    }
  }
  uomConvertion() {
    this.listDropdown.uom.forEach((element: any) => {
      if ((this.formData.uom = element.uom_code)) {
        this.qtyConvertion = parseInt(element.quantity);
      }
    });
  }

  getRowData() {
    let arr: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      arr.push({ quantity: rowNode.data.quantity });
    });
    this.totalFooter = arr;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      actionGrid: {
        menu: true,
        delete: true,
      },
      onCellEditingStopped: (params: any) => {
        if (parseInt(params.newValue) >= 101) {
          params.node.setDataValue(
            "discount_percent",
            parseInt(params.oldValue)
          );
          getToastInfo(this.$t("messages.discountExceedAHundredPercent"));
        } else {
          let pars: any = {
            product_code: params.node.data.product_code,
            member_code: params.node.data.member_code,
            outlet_code: params.node.data.outlet_code,
            discount: parseInt(params.node.data.discount_percent),
          };
          this.$emit("onEdit", pars);
        }
      },
    };
    this.columnDefs = [
      // {
      //   headerName: this.$t(""),
      //   field: "field_name",
      //   dndSource: true,
      //   width: 160,
      // },
      // { headerName: this.$t(''), field: 'id_sort', width: 160,hide: true },
      {
        headerName: this.$t("commons.table.action"),
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 95,
        headerClass: "align-header-center-suppress-menu",
      },
      {
        headerName: this.$t("commons.table.outlet"),
        field: "Outlet",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "Product",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "Price",
        width: 90,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
      },
      {
        headerName: this.$t("commons.table.discount"),
        field: "discount_percent",
        width: 90,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        editable: true,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 90,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      statusBarTotalRenderer: StatusBarTotalRenderer,
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
    this.rowModelType = "clientSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }
  mounted() {
    this.gridApi = this.gridOptions.api;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get schema() {
    return Yup.object().shape({
      location: Yup.string().required(),
    });
  }
  get disabledActionGrid() {
    return this.isSave;
  }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.totalFooter, this.columnDefs);
  }

  get activeStore() {
    return this.config.activeStore;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
