import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";

import { AgGridVue } from "ag-grid-vue3";
import {
  formatDate,
  formatDateDatabase,
  formatDateTime,
  formatNumber,
} from "@/utils/format";
import $global from "@/utils/global";
import TransactionAPI from "@/services/api/transaction";
import * as Yup from "yup";
import configStore from "@/stores/config";
import { anyToFloat, getError } from "@/utils/general";
import { reactive, ref } from "vue";
import { focusOnInvalid } from "@/utils/validation";
import BookingApi from "@/services/api/banquet/booking";
import { getToastError, getToastSuccess } from "@/utils/toast";
const bookingApi = new BookingApi();
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CSelect,
    CInput,
    AgGridVue,
  },
  props: {
    number: Number,
    isDeposit: Boolean,
  },
  emits: ["close", "save"],
})
export default class ChangeCorrectionDateForm extends Vue {
  public config = configStore();
  public rowData: any = [];
  public formPackageElement: any = ref(null);
  public isSaving: boolean = false;
  public form: any = reactive({});
  public options: any = {
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
    cardType: [],
    businessSource: [],
    commissionTypes: [],
    packages: [],
  };
  formType: string;
  bookingNumber: number;
  number: number;
  isDeposit: boolean;
  roomNumber: string;
  hasBnsSource: boolean = false;
  ColumnResOptions = [
    {
      label: "number",
      field: "Number",
      align: "left",
      width: "75",
    },
    {
      label: "venue",
      field: "Venue",
      align: "left",
      width: "100",
    },
    {
      label: "date",
      field: "Date",
      align: "left",
      width: "150",
      format: "date",
    },
    {
      label: "startTime",
      field: "Start Time",
      align: "left",
      width: "100",
    },
    {
      label: "endTime",
      field: "End Time",
      align: "left",
      width: "100",
    },
  ];
  packageList: any = [];
  gridOptions: any = {};
  global: any;
  columnDefs: any = [];
  context: any;
  rowSelection: string;
  rowModelType: string;
  gridApi: any;
  gridColumnApi: any;
  comboList: any = [];
  auditDate: any = "";

  beforeMount() {
    this.getChangeCorrectionDateTransactionList();
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.id"),
        field: "id",
        cellStyle: { textAlign: "right" },
        width: 80,
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 100,
        cellStyle: { textAlign: "center" },
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
      },
      {
        headerName: this.$t("transaction.table.transferStatus"),
        field: "TransferStatus",
        width: 180,
      },
      {
        headerName: this.$t("transaction.table.roomNumber"),
        field: "room_number",
        width: 65,
      },
      {
        headerName: this.$t("transaction.table.account"),
        field: "Account",
        width: 250,
      },
      {
        headerName: this.$t("transaction.table.debit"),
        field: "Debit",
        width: 100,
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.credit"),
        field: "Credit",
        width: 100,
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.remark"),
        field: "remark",
        width: 250,
      },
      {
        headerName: this.$t("transaction.table.currency"),
        field: "default_currency_code",
        width: 100,
      },
      {
        headerName: this.$t("transaction.table.debitForeign"),
        field: "DebitForeign",
        width: 122,
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.creditForeign"),
        field: "CreditForeign",
        width: 122,
        type: "numericColumn",
        sumTotal: true,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.currencyForeign"),
        field: "currency_code",
        width: 100,
      },
      {
        headerName: this.$t("transaction.table.exchangeRate"),
        field: "exchange_rate",
        width: 100,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("transaction.table.company"),
        field: "CompanyName",
        width: 120,
      },
      {
        headerName: this.$t("transaction.table.type"),
        field: "type",
        width: 90,
      },
      {
        headerName: this.$t("transaction.table.documentNumber"),
        field: "document_number",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.subDepartment"),
        field: "SubDepartment",
        width: 200,
      },
      {
        headerName: this.$t("transaction.table.void"),
        field: "void",
        width: 90,
        cellRenderer: "checklistRenderer",
        cellStyle: { textAlign: "center" },
        pinnedRowCellRendererParams: { style: { display: "none" } },
      },
      {
        headerName: this.$t("transaction.table.correction"),
        field: "is_correction",
        width: 90,
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
        pinnedRowCellRendererParams: { style: { display: "none" } },
      },
      {
        headerName: this.$t("transaction.table.refNumber"),
        field: "ref_number",
        width: 130,
      },
      {
        headerName: this.$t("transaction.table.createdBy"),
        field: "created_by",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.voidDate"),
        field: "void_date",
        width: 150,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
      },
      {
        headerName: this.$t("transaction.table.voidBy"),
        field: "void_by",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.voidReason"),
        field: "void_reason",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 150,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.initialize();
  }

  initialize() {
    this.resetForm();
  }

  async resetForm() {
    this.isSaving = false;
    this.auditDate = "";
  }

  onSave() {
    if (!this.rowData || this.rowData.length <= 0) {
      getToastError("No data to be process");
      return;
    }
    if (!this.auditDate) {
      getToastError("Please select a date");
      return;
    }
    this.processChangeCorrectionDate();
  }

  onGridReady() {
    //
  }

  // API REQUEST======================================================================
  async getChangeCorrectionDateTransactionList() {
    try {
      const params = {
        Number: this.number,
        IsDeposit: this.isDeposit,
      };
      const { data } =
        await transactionAPI.getChangeCorrectionDateTransactionList(params);
      this.rowData = data.transactions;
      this.options.audit_date = data.audit_dates ?? [];
    } catch (err) {
      getError(err);
    }
  }
  async processChangeCorrectionDate() {
    this.isSaving = true;
    try {
      const params = {
        number: this.number,
        is_deposit: this.isDeposit,
        audit_date: formatDateDatabase(this.auditDate),
      };
      const { data } = await transactionAPI.processChangeCorrectionDate(params);
      getToastSuccess();
      this.$emit("close", this.form);
    } catch (error) {
      getError(error);
    }
    this.isSaving = false;
  }

  // END API REQUEST==================================================================
}
