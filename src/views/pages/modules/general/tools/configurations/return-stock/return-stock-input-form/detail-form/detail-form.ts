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
import { getError, generateTotalFooterAgGrid } from "@/utils/general";
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
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import PurchaseOrderAPI from "@/services/api/assets/purchase-order/purchase-order";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";

const purchaseOrderAPI = new PurchaseOrderAPI();

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
  },
  props: {
    formType: {
      type: String,
      default: "",
      require: true,
    },
    modeData: {
      type: Number,
      require: true,
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
  public dataUpdate: any = [];
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
  public rowId: number;

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
      width: "70",
    },
    {
      label: "qty",
      field: "quantity",
      align: "left",
      width: "70",
    },
    {
      label: "basicUnit",
      field: "uom_code",
      align: "left",
      width: "70",
    },
    {
      label: "purchasePrice",
      field: "purchase_price",
      align: "left",
      width: "70",
    },
  ];

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.formDetail = {
      remark: "",
      store: {},
      item: {},
      uom: "",
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
    return params.index_id;
  }

  getUomCode(event: any) {
    this.getUom(event.target.value);
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

  getData(params: any) {
    this.insertDataGrid(params);
  }

  insertData(params: any) {
    let data: any = {
      index_id: this.id++,
      convertion: params.convertion,
      uom_code: params.uom_code,
      uom_name: params.uom_name,
      store: params.store.name,
      store_code: params.store.code,
      item: params.item.name,
      item_code: params.item.code,
      quantity: params.quantity,
      price: params.price,
      total_price: params.total_price,
      remark: params.remark,
    };

    this.insertDataGrid([data]);
  }

  insertDataGrid(params: any) {
    this.gridApi.applyTransaction({
      add: params,
    });
    console.log(this.getRowData());

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

    let arr: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      arr.push({
        quantity: rowNode.data.quantity,
        total_price: rowNode.data.total_price,
      });
    });
    this.dataUpdate = arr;

    return rowData;
  }

  handleEdit(params: any) {
    console.log(params);
    this.getUom(params.uom_code);
    this.formDetail.index_id = params.index_id;
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
      index_id: this.formDetail.index_id,
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
      this.insertData(this.formDetail);
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
  onChangeItem() {
    this.loadDropdownUOM(this.formDetail.item.code);
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

  onChangeFormList() {
    this.dataUpdate = this.getRowData();
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }

  gridFormCancel() {
    this.gridFormReset();
    this.isSave = false;
  }

  async loadDropdownUOM(params: any) {
    try {
      const { data } = await purchaseOrderAPI.GetUom(params);
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
    this.searchOptions = [
      { text: this.$t("commons.filter.refNumber"), value: 0 },
      { text: this.$t("commons.filter.company"), value: 1 },
      { text: this.$t("commons.filter.memo"), value: 2 },
      { text: this.$t("commons.filter.lastUpdate"), value: 3 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
      },
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
        width: 90,
      },
      {
        headerName: this.$t("commons.table.item"),
        field: "item",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 140,
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.uom"),
        field: "uom",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.reason"),
        field: "reason",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.itemId"),
        field: "item_id",
        width: 140,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
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
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
  }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.dataUpdate, this.columnDefs);
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
