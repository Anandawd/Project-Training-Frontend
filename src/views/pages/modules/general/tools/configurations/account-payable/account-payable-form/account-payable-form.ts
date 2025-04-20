import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import { getError } from "@/utils/general";
import {
  formatDate,
  formatDateTime,
  formatDateTimeZeroUTC,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
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
import AccountPayableAPI from "@/services/api/accounting/account-payable/account-payable";

const accountPayableAPI = new AccountPayableAPI();

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
    formType: {
      type: String,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  detailFormElement: any = ref();
  public resourceAPI: any;
  public dataRow: any;
  modeData: any;
  formType: any;
  public detail: any;
  public params: any;
  // public rowData: any = []
  public defaultForm: any = {};
  public form: any = reactive({});
  public formDetail: any = reactive({});
  listDropdown: any = {};
  listDropdownGL: any = [];
  listDropdownAccountList: any = [];
  public listData: any = [];
  public sendData: any = {};
  public data: any = {};
  public isSave: boolean = false;
  public id: number = 0;

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
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      remark: "",
      date: formatDateTimeUTC(new Date()),
      due_date: formatDateTimeUTC(this.dueDate),
    };
    this.formDetail = {
      remark: "",
      gl_account: {},
      sub_department: {},
    };
  }

  gridFormReset() {
    this.detailFormElement.resetForm();
    this.formDetail = {
      amount: 0,
      remark: "",
      gl_account: {},
      sub_department: {},
    };
    this.isSave = false;
  }

  clearDetailForm() {
    this.formDetail = {
      remark: "",
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
      node.data.amount = parseFloat(node.data.amount);
      rowData.push(node.data);
    });
    return rowData;
  }

  insertDataGrid() {
    this.data = {
      id: this.id++,
      SubDepartment: this.formDetail.sub_department.name,
      sub_department_code: this.formDetail.sub_department.code,
      Account: this.formDetail.gl_account.name,
      account_code: this.formDetail.gl_account.code,
      amount: this.formDetail.amount,
      remark: this.formDetail.remark,
    };
    this.gridApi.applyTransaction({
      add: [this.data],
    });
    console.log(this.data);

    this.gridFormReset();
  }

  handleEdit(params: any) {
    console.log(params);
    this.formDetail.id = params.id;
    this.formDetail.sub_department = {
      code: params.sub_department_code,
      name: params.SubDepartment,
    };
    this.formDetail.gl_account = {
      code: params.account_code,
      name: params.Account,
    };
    this.formDetail.amount = params.amount;
    this.formDetail.remark = params.remark;
    this.isSave = true;
    this.loadDropdownGL(this.formDetail.sub_department.code);
  }
  updateDataGrid() {
    this.data = {
      id: this.formDetail.id,
      SubDepartment: this.formDetail.sub_department.name,
      sub_department_code: this.formDetail.sub_department.code,
      Account: this.formDetail.gl_account.name,
      account_code: this.formDetail.gl_account.code,
      amount: this.formDetail.amount,
      remark: this.formDetail.remark,
    };
    this.gridApi.applyTransaction({
      update: [this.data],
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
    this.detailFormElement.$el.requestSubmit();
  }

  onSaveGrid() {
    console.log(this.formDetail);

    if (this.isSave) {
      this.updateDataGrid();
    } else {
      this.insertDataGrid();
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
      getToastError(this.$t("Please insert detail"));
    }
    this.sendData.is_ap = this.$route.meta.isAp;
    this.sendData.is_accrued =
      this.formType === $global.formType.accruedExpense ? true : false;
    (this.sendData.company_code = this.form.company_code),
      (this.sendData.document_number = this.form.document_number),
      (this.sendData.account_code = this.form.ap_account),
      (this.sendData.sub_department_code = this.form.sub_department_code),
      (this.sendData.remark = this.form.remark),
      (this.sendData.date = formatDateTimeZeroUTC(this.form.date));
    this.sendData.due_date = formatDateTimeZeroUTC(this.form.due_date);
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onSave() {
    this.$emit("save", this.sendData);
  }

  onSubmit() {
    this.inputForm();
    console.log(this.sendData);
    if (this.sendData.transaction_detail.length > 0) {
      this.inputFormValidation.$el.requestSubmit();
    }
  }

  async onEditForm() {
    await this.loadDropdownAccount(this.form.sub_department_code);
    await this.loadDropdownGL(this.formDetail.sub_department.code);
  }

  async initialize() {
    this.resetForm();
  }

  onClose() {
    this.$emit("close");
  }

  onChangeSubDepartmentDetail() {
    this.loadDropdownGL(this.formDetail.sub_department.code);
  }

  async loadDropdownGL(params: any) {
    try {
      let params = {
        SubDepartmentCode: this.formDetail.sub_department.code,
      };
      const { data } = await accountPayableAPI.GetAPARGLAccountList(params);
      this.listDropdownGL = data;
    } catch (error: any) {
      getError(error);
    }
  }

  onChangeSubDepartment() {
    this.loadDropdownAccount(this.form.sub_department_code);
  }

  async loadDropdownAccount(params: any) {
    try {
      let params = {
        SubDepartmentCode: this.form.sub_department_code,
      };
      const { data } = await accountPayableAPI.GetAPARAccountList(params);
      this.listDropdownAccountList = data;
    } catch (error: any) {
      getError(error);
    }
  }

  changeCompany() {
    this.form.due_date = formatDateTimeUTC(this.dueDate);
  }

  get dueDate() {
    let date = new Date();
    let due_date: number = 0;
    for (const i in this.listDropdown.Company) {
      if (this.listDropdown.Company[i].code === this.form.company_code) {
        due_date = this.listDropdown.Company[i].invoice_due;
      }
    }
    const dateNow = date.getDate();
    if (due_date > 0) {
      date.setDate(dateNow + due_date);
    } else {
      date.setDate(dateNow + 7);
    }
    return date;
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return this.formType === $global.formType.accruedExpense
        ? `${this.$t("commons.insert")} Accrued Expense`
        : `${this.$t("commons.insert")} ${this.$t(
            `${this.$route.meta.pageTitle}`
          )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return this.formType === $global.formType.accruedExpense
        ? `${this.$t("commons.update")} Accrued Expense`
        : `${this.$t("commons.update")} ${this.$t(
            `${this.$route.meta.pageTitle}`
          )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return this.formType === $global.formType.accruedExpense
        ? `${this.$t("commons.duplicate")} Accrued Expense`
        : `${this.$t("commons.duplicate")} ${this.$t(
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
        headerName: this.$t("commons.table.accountCode"),
        field: "account_code",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 140,
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

  //Validation
  get schema() {
    return Yup.object().shape({
      Date: Yup.string().required(),
      sub_department_code: Yup.string().required(),
      document_number: Yup.string().required(),
      ap_account: Yup.string().required(),
      company: Yup.string().required(),
      // Value: Yup.number().required().test((val: number) => val <= this.form.value2),
    });
  }

  get schemaDetail() {
    return Yup.object().shape({
      // sub_department: Yup.array().required(),
      sub_department: Yup.object()
        .shape({
          name: Yup.string().required(),
          code: Yup.string().required(),
        })
        .required(),
      gl_account: Yup.object().shape({
        name: Yup.string().required(),
        code: Yup.string().required(),
      }),
      amount: Yup.number().required(),
      // Value: Yup.number().required().test((val: number) => val <= this.form.value2),
    });
  }
}
