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
import JournalAPI from "@/services/api/accounting/journal/journal";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";

const journalAPI = new JournalAPI();

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
    dateBalance: {
      type: String,
    },
  },
  emits: ["save", "close"],
})
export default class FormTemplate extends Vue {
  inputFormElement: any = ref();
  formElement: any = ref();
  modeData: any;
  public rowDataId = 0;
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
  listDropdownGL: any = {};
  public searchOptions: any;
  public isSave: boolean = false;
  public dateBalance: any;

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

  async resetForm() {
    this.formElement.resetForm();
    await this.$nextTick();
    this.formDetail = {
      remark: "",
      sub_department: {},
      gl_account: {},
    };
    this.rowData = [];
  }

  gridFormReset() {
    this.formElement.resetForm();
    this.formDetail = {
      amount: 0,
      remark: "",
      gl_account: {},
      sub_department: {},
    };
    this.isSave = false;
  }

  getRowNodeId(params: any) {
    return params.id;
  }

  getData(params: any) {
    this.insertDataGrid(params);
  }

  insertData(params: any) {
    let data: any = {
      id: this.rowDataId++,
      SubDepartment: params.sub_department.name,
      sub_department_code: params.sub_department.code,
      name: params.gl_account.name,
      account_code: params.gl_account.code,
      amount: params.amount,
      remark: params.remark,
    };
    this.insertDataGrid([data]);
  }

  insertDataGrid(params: any) {
    this.gridApi.applyTransaction({
      add: params,
    });
    this.gridFormReset();
  }
  getRowData() {
    let rowData: any = [];
    this.gridApi.forEachNode(function (node: any) {
      node.data.amount = parseFloat(node.data.amount);
      rowData.push(node.data);
    });

    let arr: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      arr.push({ amount: rowNode.data.amount });
    });
    this.dataUpdate = arr;
    return rowData;
  }
  handleEdit(params: any) {
    console.log(this.getRowData());

    this.formDetail.id = params.id;
    this.formDetail.sub_department = {
      code: params.sub_department_code,
      name: params.SubDepartment,
    };
    this.formDetail.gl_account = {
      code: params.account_code,
      name: params.name,
    };
    this.formDetail.amount = params.amount;
    this.formDetail.remark = params.remark;
    this.isSave = true;
    this.loadDropdownGL(this.formDetail.sub_department.code);
    this.loadDropdownBalance("");
  }

  updateDataGrid() {
    let data: any = {
      id: this.formDetail.id,
      SubDepartment: this.formDetail.sub_department.name,
      sub_department_code: this.formDetail.sub_department.code,
      name: this.formDetail.gl_account.name,
      account_code: this.formDetail.gl_account.code,
      amount: this.formDetail.amount,
      remark: this.formDetail.remark,
    };
    this.gridApi.applyTransaction({
      update: [data],
    });
    this.gridFormReset();
  }

  handleSaveGrid() {
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

  onChangeSubDepartment() {
    this.loadDropdownGL(this.formDetail.sub_department.code);
  }

  onChangeGLAccount() {
    this.loadDropdownBalance("");
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

  async loadDropdownGL(params: any) {
    try {
      let params = {
        SubDepartmentCode: this.formDetail.sub_department.code,
      };
      const { data } = await journalAPI.GetGLAccountList(params);
      this.listDropdownGL = data;
    } catch (error: any) {
      getError(error);
    }
  }

  async loadDropdownBalance(params: any) {
    try {
      let params = {
        JournalAccountCode: this.formDetail.gl_account.code,
        Date: formatDateTimeZeroUTC(this.dateBalance),
      };
      const { data } = await journalAPI.GetJournalAccountBalance(params);
      this.formDetail.balance = data;
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
        width: 110,
      },
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "SubDepartment",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.id"),
        field: "id",
        hide: true,
        width: 140,
      },
      {
        headerName: this.$t("commons.table.subDepartmentCode"),
        hide: true,
        field: "sub_department_code",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.journalAccountCode"),
        field: "account_code",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.journalAccount"),
        field: "name",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 140,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
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
      sub_department: Yup.object()
        .required()
        .test((val: any) => Object.keys(val).length > 0),
      gl_account: Yup.object()
        .required()
        .test((val: any) => Object.keys(val).length > 0),
      amount: Yup.number().required(),
      // Value: Yup.number().required().test((val: number) => val <= this.form.value2),
    });
  }
}
