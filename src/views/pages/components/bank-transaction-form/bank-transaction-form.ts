import { Options, Vue } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "../../../../components/radio/radio.vue";
import * as Yup from "yup";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { reactive, ref } from "vue";
import { getToastSuccess, getToastInfo } from "@/utils/toast";
import { BTabs, BTab } from "bootstrap-vue-3";
import {
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatDateTimeZeroUTC,
  formatNumber,
} from "@/utils/format";
import { copyValueDoubleClick } from "@/utils/general";
import { AgGridVue } from "ag-grid-vue3";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import bankTransactionAPI from "../../../../services/api/accounting/bank-transaction/bank-transaction";
const BankTransactionAPI = new bankTransactionAPI();
import ConfigStore from "@/stores/config";
const configStore = ConfigStore();

@Options({
  name: "InputForm",
  components: {
    BTabs,
    BTab,
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
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  inputFormValidation: any = ref();
  modeData: any;
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
  public totalFooter: any = [];
  public isSaving: boolean = false;

  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  columnOptionsBankAccount = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "accountCode",
      field: "journal_account_code",
      align: "left",
      width: "120",
      filter: true,
    },
    {
      label: "bankAccountNumber",
      field: "bank_account_number",
      align: "left",
      width: "180",
      filter: true,
    },
  ];

  columnOptionsAccount = [
    {
      label: "code",
      field: "code",
      align: "left",
      width: "70",
      filter: true,
    },
    {
      label: "name",
      field: "name",
      align: "left",
      width: "120",
      filter: true,
    },
  ];

  columnOptionsTransactionID = [
    {
      label: "TransactionID",
      field: "TransactionID",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "folioRsv",
      field: "Number",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "roomNumber",
      field: "room_number",
      align: "left",
      width: "80",
      filter: true,
    },
    {
      label: "amount",
      field: "Amount",
      align: "right",
      width: "130",
      filter: true,
      format: "number",
    },
    {
      label: "guestName",
      field: "GuestName",
      align: "left",
      width: "130",
      filter: true,
    },
    {
      label: "auditDate",
      field: "audit_date",
      align: "center",
      width: "130",
      filter: true,
      format: "date",
    },
  ];

  // Dropdown Options
  listDropdown: any = {
    bankAccount: [],
    account: [],
    transaction_id: [],
  };
  populateParams: any = {};
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
    this.form = {
      date: formatDateTimeUTC(new Date()),
      transaction_detail: [],
      remark: "",
    };
    this.idGrid = 0;
    this.getRowData();
    setInputFocus();
  }
  async resetForm2() {
    let dates = this.form.date;
    let amounts = this.form.amount;
    let bankAccounts = this.form.bank_account_code;
    let remarks = this.form.remark;
    let accounts = this.form.account_code;
    let ids = 0;
    let ref_numbers = "";
    if (this.form.id != undefined) {
      ids = this.form.id;
    }
    if (this.form.ref_number != undefined) {
      ref_numbers = this.form.ref_number;
    }
    this.form = {
      date: dates,
      amount: amounts,
      bank_account_code: bankAccounts,
      remark: remarks,
      account_code: accounts,
      id: ids,
      ref_number: ref_numbers,
    };
    this.account_code = "";
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    this.resetForm2();
    let array: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      if (rowNode.data.remarks == undefined) {
        rowNode.data.remarks = "";
      }
      // this.listDropdown.transaction_id.forEach((element: any) => {
      //   if (element.TransactionID == rowNode.data.TransactionID) {
      //     array.push({
      //       transaction_id: element.TransactionID,
      //       amount: parseInt(element.Amount),
      //       account_code: element.journal_account_code,
      //       remark: rowNode.data.remarks,
      //       document_number: element.document_number,
      //       audit_date: element.audit_date,
      //     });
      //   }
      // });
      array.push({
        transaction_id: rowNode.data.TransactionID,
        amount: parseInt(rowNode.data.Amount),
        account_code: rowNode.data.journal_account_code,
        remark: rowNode.data.remarks,
        document_number: rowNode.data.document_number,
        audit_date: rowNode.data.audit_date,
      });
    });
    this.form.transaction_detail = array;
    this.form.date = formatDateTimeZeroUTC(this.form.date);
    if (array.length != 0) {
      if (this.totalAmount >= this.form.amount) {
        this.$emit("save", this.form);
        this.isSaving = true;
        // this.rowData = [];
      } else {
        getToastInfo(this.$t("messages.amountCaanotGreatherThanOutstanding"));
      }
    } else {
      getToastInfo(this.$t("messages.selectTransaction"));
    }
  }
  onClose() {
    this.$emit("close");
    this.rowData = [];
    this.isSave = false;
  }

  handleRowDoubleClicked(params: any) {
    this.handleEdit(params.data);
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

  handleDoubleClick() {
    this.form.amount = parseFloat(copyValueDoubleClick(this.totalAmount));
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }
  loadStatelist() {}
  getRowNodeId(params: any) {
    return params.idGrid;
  }

  gridFormCancel() {
    this.resetForm2();
    this.isSave = false;
    this.idGridEdit = 0;
  }

  // addAccountIfNotExists(data: any) {
  //   const existingAccountIndex = this.listDropdown.transaction_id.findIndex((account: any) => account.TransactionID === data.TransactionID);

  //   if (existingAccountIndex === -1) {
  //     this.listDropdown.transaction_id.push({
  //       transaction_id: data.TransactionID,
  //       amount: parseInt(data.Amount),
  //       account_code: data.journal_account_code,
  //       remark: data.remarks,
  //       document_number: data.document_number,
  //       audit_date: data.audit_date,
  //     });;
  //   }
  // }

  async handleEdit(params: any) {
    // this.addAccountIfNotExists(params)
    this.form.account_code = "";
    this.populateTransaction();
    this.idGridEdit = params.idGrid;
    this.form.transaction_id = params.TransactionID;
    this.form.Number = params.Number;
    this.form.room_number = params.room_number;
    this.form.GuestName = params.GuestName;
    this.form.card_holder = params.card_holder;
    this.form.document_number = params.document_number;
    this.form.card_holder = params.card_holder;
    this.form.card_number = params.card_number;
    this.form.Amount = params.Amount;
    this.form.audit_date = params.audit_date;
    this.form.remark1 = params.remarks;
    this.account_code = params.journal_account_code;
    this.isSave = true;
    this.dataEdited = params.TransactionID;
  }

  handleSaveGrid() {
    if (this.isSave) {
      this.updateDataGrid();
    } else {
      let parameters = {
        TransactionID: this.form.transaction_id,
        Number: this.form.Number,
        room_number: this.form.room_number,
        Amount: this.form.Amount,
        GuestName: this.form.GuestName,
        document_number: this.form.document_number,
        card_holder: this.form.card_holder,
        card_number: this.form.card_number,
        audit_date: this.form.audit_date,
        remarks: this.form.remark1,
        journal_account_code: this.account_code,
      };
      this.insertDataGrid(parameters, "");
    }
  }

  handleDelete(params: any) {
    this.gridApi.applyTransaction({
      remove: [params],
    });
    this.resetForm2();
  }
  countTotalAmount() {
    let tot = 0;
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      tot = tot + parseInt(rowNode.data.Amount);
    });
    this.totalAmount = tot;
  }

  updateDataGrid() {
    if (this.checkTransactionID()) {
      if (this.form.transaction_id != "") {
        let data = {
          idGrid: this.idGridEdit,
          TransactionID: this.form.transaction_id,
          Number: this.form.Number,
          room_number: this.form.room_number,
          Amount: this.form.Amount,
          GuestName: this.form.GuestName,
          document_number: this.form.document_number,
          card_holder: this.form.card_holder,
          card_number: this.form.card_number,
          audit_date: this.form.audit_date,
          remarks: this.form.remark1,
          journal_account_code: this.account_code,
        };
        this.gridApi.applyTransaction({
          update: [data],
        });
        this.isSave = false;
        this.resetForm2();
        this.idGridEdit = 0;
        this.countTotalAmount();
      } else {
        getToastInfo(this.$t("messages.dataIsAlreadyExist"));
      }
    } else {
      getToastInfo(this.$t("messages.dataIsAlreadyExist"));
    }
  }

  populateTransaction() {
    this.resetForm2();
    let params: any = {
      AccountCode: this.form.account_code,
      ReconciliationId: "",
    };
    this.populateParams = params;
    this.GetBankReconciliationTransactionComboList(params);
  }

  populateInputForm(id: any) {
    this.listDropdown.transaction_id.forEach((element: any) => {
      if (element.TransactionID == id) {
        this.form.Number = element.Number;
        this.form.room_number = element.room_number;
        this.form.GuestName = element.GuestName;
        this.form.card_holder = element.card_holder;
        this.form.document_number = element.document_number;
        this.form.card_number = element.card_number;
        this.form.Amount = parseInt(element.Amount);
        this.form.audit_date = element.audit_date;
        this.account_code = element.journal_account_code;
      }
    });
  }
  insertDataGrid(parameters: any, mode: string) {
    if (this.form.transaction_id != undefined || mode == "load") {
      if (this.checkTransactionID()) {
        let idIncrement = this.idGrid + 1;
        this.idGrid = idIncrement;
        let data = {
          idGrid: idIncrement,
          TransactionID: parameters.TransactionID,
          Number: parameters.Number,
          room_number: parameters.room_number,
          Amount: parameters.Amount,
          GuestName: parameters.GuestName,
          document_number: parameters.document_number,
          card_holder: parameters.card_holder,
          card_number: parameters.card_number,
          audit_date: parameters.audit_date,
          remarks: parameters.remarks,
          journal_account_code: parameters.journal_account_code,
        };
        this.gridApi.applyTransaction({
          add: [data],
        });
        this.resetForm2();
        this.countTotalAmount();
      } else {
        getToastInfo(this.$t("messages.dataIsAlreadyExist"));
      }
    } else {
      getToastInfo(this.$t("messages.selectAccount"));
    }
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

  getRowData() {
    let arr: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      arr.push({ Amount: rowNode.data.Amount });
    });
    this.totalFooter = arr;

    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }

  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown");
    this.GetBankReconciliationTransactionComboList(this.populateParams);
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async GetBankReconciliationTransactionComboList(params: any) {
    try {
      let parameters = {
        AccountCode: params.AccountCode,
        ReconciliationId: params.ReconciliationId,
      };
      const { data } =
        await BankTransactionAPI.GetBankReconciliationTransactionComboList(
          parameters
        );
      this.listDropdown.transaction_id = data;
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
      },
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "idGrid",
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
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.transactionID"),
        field: "TransactionID",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.folioOrResv"),
        field: "Number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.room"),
        field: "room_number",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "Amount",
        width: 130,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.guestName"),
        field: "GuestName",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.documentNumber"),
        field: "document_number",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.cardHolder"),
        field: "card_holder",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.ccNumber"),
        field: "card_number",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 140,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remarks",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "journal_account_code",
        width: 100,
        hide: true,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      statusBarTotalRenderer: StatusBarTotalRenderer,
    };
    this.rowGroupPanelShow = "never";
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

  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result = [
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
  mounted() {
    this.gridApi = this.gridOptions.api;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get schema() {
    return Yup.object().shape({
      date: Yup.string().required(),
      amountRecieved: Yup.number().required(),
      bankAccount: Yup.string().required(),
    });
  }
  get disabledActionGrid() {
    return this.isSave;
  }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.totalFooter, this.columnDefs);
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
  get auditDate() {
    return configStore.auditDate;
  }
  get defaultSubDept() {
    return configStore.sdAccounting;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
