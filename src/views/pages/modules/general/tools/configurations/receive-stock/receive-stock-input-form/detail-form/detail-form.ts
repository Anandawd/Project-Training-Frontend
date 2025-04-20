import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
  formatDateTimeZeroUTC,
} from "@/utils/format";
import { getError } from "@/utils/general";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import ActionDuplicate from "@/components/ag_grid-framework/action_grid.vue";
import ReceiveStockAPI from "@/services/api/assets/receive-stock/receive-stock";
import Checklist from "@/components/ag_grid-framework/checklist.vue";

const receiveStockAPI = new ReceiveStockAPI();

@Options({
  name: "FormTemplate",
  components: {
    Form,
    CRadio,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    AgGridVue,
    ActionDuplicate,
  },
  props: {
    formType: {
      type: String,
      default: "",
      require: true,
    },
    disableForm: {
      type: Boolean,
      require: true,
    },
    modeData: {
      type: Number,
      require: true,
    },
  },
  watch: {
    disableForm(val) {
      console.log(val);
    },
  },
  emits: ["save", "close"],
})
export default class FormTemplate extends Vue {
  inputFormElement: any = ref();
  formElement: any = ref();
  modeData: any;
  public id: number = 0;
  public rowData: any = [];
  public sendData: any = reactive({
    room_number: "",
    from_date: "",
    to_date: "",
    type_code: "",
    company_code: "",
    note: "",
  });
  public defaultForm: any = {};
  public formDetail: any = reactive({});
  public formType: any;
  listDropdown: any = {};
  listDropdownUom: any = [];
  public searchOptions: any;
  public isSave: boolean = false;
  public dateBalance: any;
  public disableForm: boolean = false;

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

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "150",
    },
    {
      label: "basicUnit",
      field: "uom_code",
      align: "left",
      width: "100",
    },
    {
      label: "purchasePrice",
      field: "purchase_price",
      align: "left",
      width: "100",
    },
  ];

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.formDetail = {
      remark: "",
      asCogsExpense: 0,
      store: {},
      item: "",
      uom: "",
      separate: false,
    };
    this.rowData = [];
  }

  gridFormReset() {
    this.formElement.resetForm();
    this.formDetail = {
      quantity: 0,
      remark: "",
      gl_account: {},
      sub_department: {},
    };
    this.isSave = false;
  }

  getRowNodeId(params: any) {
    return params.id;
  }

  getUomCode(event: any) {
    // console.log(event.target.value);

    this.getUom(event.target.value);
  }

  changeSeparate(event: any) {
    this.$emit("disableSeparate", event.target.checked);
  }

  changeRadio() {
    console.log(this.formDetail.asCogsExpense);
  }

  getUom(uom: any) {
    for (const i in this.listDropdownUom) {
      if (this.listDropdownUom[i].uom_code === uom) {
        this.formDetail.convertion = this.listDropdownUom[i].quantity;
        this.formDetail.uom_code = this.listDropdownUom[i].uom_code;
        this.formDetail.uom_name = this.listDropdownUom[i].name;
      }
    }
  }

  getStoreId(code: any) {
    for (const i in this.listDropdown.Store) {
      if (this.listDropdown.Store[i].code === code) {
        this.formDetail.store_id = parseInt(i) + 1;
      }
    }
  }

  getItem(code: any) {
    for (const i in this.listDropdown.InventoryItem) {
      if (this.listDropdown.InventoryItem[i].code === code) {
        this.formDetail.item = this.listDropdown.InventoryItem[i].name;
        this.formDetail.item_code = this.listDropdown.InventoryItem[i].code;
        this.formDetail.item_uom_code =
          this.listDropdown.InventoryItem[i].uom_code;
        this.formDetail.item_price =
          this.listDropdown.InventoryItem[i].purchase_price;
        this.formDetail.item_id = parseInt(i) + 1;

        // console.log(this.formDetail.item_uom_code);
      }
    }
  }

  insertDataGrid() {
    console.log(this.formDetail);

    let data: any = {
      id: this.id++,
      convertion: this.formDetail.convertion,
      uom_code: this.formDetail.uom_code,
      uom_name: this.formDetail.uom_name,
      store: this.formDetail.store.name,
      store_code: this.formDetail.store.code,
      item: this.formDetail.item,
      item_code: this.formDetail.item_code,
      quantity: this.formDetail.quantity,
      price: this.formDetail.price,
      total_price: this.formDetail.total_price,
      remark: this.formDetail.remark,
      as_cogs: this.formDetail.asCogsExpense === 0 ? 1 : 0,
      as_expense: this.formDetail.asCogsExpense,
      item_id: this.formDetail.item_id,
      store_id: this.formDetail.store_id,
    };

    this.gridApi.applyTransaction({
      add: [data],
    });
    this.gridFormReset();
  }
  getRowData() {
    let rowData: any = [];
    this.gridApi.forEachNode(function (node: any) {
      rowData.push(node.data);
      node.data.convertion = parseFloat(node.data.convertion);
      node.data.price = parseFloat(node.data.price);
      node.data.quantity = parseFloat(node.data.quantity);
    });
    return rowData;
  }

  handleEdit(params: any) {
    console.log(params);
    this.getUom(params.uom_code);
    this.formDetail.id = params.id;
    this.formDetail.store = { code: params.store_code, name: params.store };
    this.formDetail.item = { code: params.item_code, name: params.item };
    this.formDetail.quantity = params.quantity;
    this.formDetail.price = params.price;
    this.formDetail.total_price = params.total_price;
    this.formDetail.uom = params.uom_code;
    this.formDetail.remark = params.remark;
    this.isSave = true;
    // this.loadDropdownGL(this.formDetail.sub_department.code)
  }

  updateDataGrid() {
    let data: any = {
      id: this.formDetail.id,
      convertion: this.formDetail.convertion,
      uom_code: this.formDetail.uom_code,
      uom_name: this.formDetail.uom_name,
      store: this.formDetail.store.name,
      store_code: this.formDetail.store.code,
      item: this.formDetail.item.name,
      item_code: this.formDetail.item.code,
      quantity: this.formDetail.quantity,
      price: this.formDetail.price,
      total_price: this.formDetail.total_price,
      remark: this.formDetail.remark,
    };
    this.gridApi.applyTransaction({
      update: [data],
    });
    this.gridFormReset();
  }

  handleSaveGrid() {
    // console.log('tes');

    this.formElement.$el.requestSubmit();
  }

  onSaveGrid() {
    if (this.isSave) {
      this.updateDataGrid();
    } else {
      this.insertDataGrid();
    }
  }

  handleDelete(params: any) {
    // console.log(params);
    this.gridApi.applyTransaction({
      remove: [params],
    });
    this.gridFormReset();
  }

  onSave() {
    this.$emit("save", this.formDetail);
  }

  initialize(listDropdown: any) {
    this.listDropdown = listDropdown;
    this.resetForm();
  }

  onChangeQuantity() {
    this.formDetail.total_price =
      this.formDetail.price * this.formDetail.quantity;
    this.formDetail.price =
      this.formDetail.total_price / this.formDetail.quantity;
  }
  onChangePrice() {
    this.formDetail.total_price =
      this.formDetail.price * this.formDetail.quantity;
  }

  onChangeTotalPrice() {
    this.formDetail.price =
      this.formDetail.total_price / this.formDetail.quantity;
  }

  onChangeStore(event: any) {
    this.getStoreId(event.target.value.code);
  }

  onChangeFormList() {
    const rowData = this.getRowData();
    this.$emit("getDetailList", rowData);
  }

  async onChangeItem() {
    await this.loadDropdownUOM(this.formDetail.item);
    this.getItem(this.formDetail.item);
    this.getUom(this.formDetail.item_uom_code);
    this.formDetail.uom = this.formDetail.uom_name;
    this.formDetail.price = this.formDetail.item_price;
    // console.log(this.formDetail.uom_code);
  }

  onSubmit() {
    this.inputFormElement.$el.requestSubmit();
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  gridFormCancel() {
    this.gridFormReset();
    this.isSave = false;
  }

  async loadDropdownUOM(params: any) {
    try {
      const { data } = await receiveStockAPI.GetUom(params);
      this.listDropdownUom = data;
    } catch (error: any) {
      getError(error);
    }
  }
  // Validation
  get schema() {
    return Yup.object().shape({
      RoomNumber: Yup.string().required(),
      Type: Yup.string().required(),
      FromDate: Yup.string().required(),
      ToDate: Yup.string().required(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }

  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "Code",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        suppressMoveable: true,
        lockPosition: "left",
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 110,
      },
      {
        headerName: this.$t("commons.table.store"),
        field: "store",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.id"),
        field: "id",
        hide: true,
        width: 130,
      },
      {
        headerName: this.$t("commons.table.subDepartmentCode"),
        hide: true,
        field: "store_code",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.item"),
        field: "item",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.subDepartmentCode"),
        hide: true,
        field: "item_code",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.uom"),
        field: "uom_name",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.subDepartmentCode"),
        hide: true,
        field: "uom_code",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.subDepartmentCode"),
        hide: true,
        field: "convertion",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "price",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.totalPrice"),
        field: "total_price",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.discount"),
        field: "discount",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.tax"),
        field: "tax",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.expire"),
        field: "expire",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.poQuantity"),
        field: "po_quantity",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.asCogs"),
        field: "as_cogs",
        width: 130,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.asExpense"),
        field: "as_expense",
        width: 130,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.itemGroup"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.storeId"),
        field: "store_id",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.itemId"),
        field: "item_id",
        width: 130,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionDuplicate,
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
  }

  get schemaCredit() {
    return Yup.object().shape({
      // sub_department: Yup.array().required(),
      // sub_department: Yup.object()
      //   .required()
      //   .test((val: any) => Object.keys(val).length > 0),
      // gl_account: Yup.object()
      //   .required()
      //   .test((val: any) => Object.keys(val).length > 0),
      quantity: Yup.number().required(),
      // Value: Yup.number().required().test((val: number) => val <= this.form.value2),
    });
  }
}
