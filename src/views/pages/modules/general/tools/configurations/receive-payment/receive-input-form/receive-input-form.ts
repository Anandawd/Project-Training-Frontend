import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import { getError, generateTotalFooterAgGrid } from "@/utils/general";
import {
  formatDate,
  formatDateTime,
  formatDateTimeZeroUTC,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import { getToastError, getToastSuccess } from "@/utils/toast";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import ReceiveAPI from "@/services/api/accounting/receive-payment/receive";
import PaymentAPI from "@/services/api/accounting/receive-payment/payment";

const receiveAPI = new ReceiveAPI();
const paymentAPI = new PaymentAPI();

@Options({
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
    modeData: {
      type: Number,
      require: true,
    },
    rowData: {
      type: Array,
      default: [],
    },
    rowDataId: {
      type: Number,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  debitFormElement: any = ref();
  creditFormElement: any = ref();
  inputFormElement: any = ref();

  public resourceAPI: any;
  public rowDataId = 0;
  modeData: any;
  public detail: any;
  public params: any;
  // public rowData: any = []
  public defaultForm: any = {};
  public form: any = reactive({});
  public formDetail: any = reactive({});
  listDropdown: any = {};
  listDropdownGL: any = {};
  public listData: any = [];
  public sendData: any = {};
  public isSave: boolean = false;
  public id: any;
  public dataUpdate: any = [];

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

  async resetForm() {
    this.inputFormElement.resetForm();
    await this.$nextTick();
    this.form = {
      remark: "",
      date: formatDateTimeUTC(new Date()),
    };
    this.formDetail = {
      remarkCredit: "",
      sub_department: {},
      gl_account: {},
    };
    this.sendData = { transaction_detail: [] };
  }

  clearDetailForm() {
    this.formDetail = {
      remarkCredit: "",
      sub_department: {},
      gl_account: {},
    };
  }

  getRowNodeId(params: any) {
    return params.id;
  }

  getRowData() {
    let rowData: any = [];
    this.gridApi.forEachNode(function (node: any) {
      rowData.push(node.data);
    });

    let arr: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      arr.push({ amount: rowNode.data.amount });
    });
    this.dataUpdate = arr;
    return rowData;
  }

  gridFormReset() {
    this.creditFormElement.resetForm();
    this.formDetail = {
      amount: 0,
      remarkCredit: "",
      gl_account: {},
      sub_department: {},
    };
    this.isSave = false;
  }

  getData(params: any) {
    this.insertDataGrid(params);
  }

  insertData(params: any) {
    let data: any = {
      id: this.id++,
      SubDepartment: params.sub_department.name,
      sub_department_code: params.sub_department.code,
      name: params.gl_account.name,
      account_code: params.gl_account.code,
      SubGroupName: params.gl_account.SubGroupName,
      amount: params.amount,
      remark: params.remarkCredit,
    };

    this.insertDataGrid([data]);
  }

  insertDataGrid(params: any) {
    this.gridApi.applyTransaction({
      add: params,
    });
    this.gridFormReset();
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
      SubGroupName: params.SubGroupName,
    };
    this.formDetail.amount = params.amount;
    this.formDetail.remarkCredit = params.remark;
    this.isSave = true;
    this.loadDropdownGL(this.formDetail.sub_department.code);
  }
  updateDataGrid() {
    this.gridApi.applyTransaction({
      update: [
        {
          id: this.formDetail.id,
          SubDepartment: this.formDetail.sub_department.name,
          sub_department_code: this.formDetail.sub_department.code,
          name: this.formDetail.gl_account.name,
          account_code: this.formDetail.gl_account.code,
          SubGroupName: this.formDetail.gl_account.SubGroupName,
          amount: this.formDetail.amount,
          remark: this.formDetail.remarkCredit,
        },
      ],
    });
    console.log(this.getRowData());

    this.gridFormReset();
  }

  handleDelete(params: any) {
    // console.log(params);
    this.gridApi.applyTransaction({
      remove: [params],
    });
    this.gridFormReset();
  }

  handleSaveGrid() {
    this.creditFormElement.$el.requestSubmit();
  }

  onSaveGrid() {
    console.log(this.formDetail);

    if (this.isSave) {
      this.updateDataGrid();
    } else {
      this.insertData(this.formDetail);
    }
  }

  gridFormCancel() {
    this.gridFormReset();
    this.isSave = false;
  }

  inputForm() {
    const transaction = this.getRowData();
    if (transaction.length > 0) {
      this.sendData.transaction_detail = transaction;
    } else {
      getToastError(this.$t("messages.insertCreditDetail"));
    }

    if (this.modeData === $global.modeData.edit) {
      this.sendData.ref_number = this.form.ref_number;
      (this.sendData.company_code = this.form.company_code),
        (this.sendData.bank_account_code = this.form.journal_account_code),
        (this.sendData.sub_department_code = this.form.sub_department_code),
        (this.sendData.remark = this.form.remark),
        (this.sendData.date = formatDateTimeZeroUTC(this.form.date));
    } else {
      (this.sendData.company_code = this.form.company_code),
        (this.sendData.bank_account_code = this.form.journal_account_code),
        (this.sendData.sub_department_code = this.form.sub_department_code),
        (this.sendData.remark = this.form.remark),
        (this.sendData.date = formatDateTimeZeroUTC(this.form.date));
    }
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onSave() {
    this.$emit("save", this.sendData);
  }

  onSubmit() {
    this.inputForm();
    if (this.sendData.transaction_detail.length > 0) {
      this.inputFormElement.$el.requestSubmit();
    }
  }

  async initialize() {
    this.id = this.rowDataId;
    // await this.loadDropdownGL(this.formDetail.sub_department.code)
    this.resetForm();
  }

  onClose() {
    this.$emit("close");
  }

  onChangeSubDepartment() {
    this.loadDropdownGL(this.formDetail.sub_department.code);
  }

  async loadDropdownGL(params: any) {
    try {
      let params = {
        SubDepartmentCode: this.formDetail.sub_department.code,
      };
      const { data } = await this.resourceAPI.GetGLAccountList(params);
      this.listDropdownGL = data;
    } catch (error: any) {
      getError(error);
    }
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
        width: 80,
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
        headerName: this.$t("commons.table.journalAccount"),
        hide: true,
        field: "SubGroupName",
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
    this.resourceAPI = this.$route.meta.isPayment ? paymentAPI : receiveAPI;
    this.gridApi = this.gridOptions.api;
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      Date: Yup.string().required(),
      sub_department_code: Yup.string().required(),
      bank_account: Yup.string().required(),
      company: Yup.string().required(),
      // Value: Yup.number().required().test((val: number) => val <= this.form.value2),
    });
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
      amount: Yup.number().required(),
      // Value: Yup.number().required().test((val: number) => val <= this.form.value2),
    });
  }
}
