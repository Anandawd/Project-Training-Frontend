import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CRadio from "@/components/radio/radio.vue";
import CInput from "@/components/input/input.vue";

import { AgGridVue } from "ag-grid-vue3";
import { formatDate, formatNumber } from "@/utils/format";
import $global from "@/utils/global";
import TransactionAPI from "@/services/api/transaction";
import { getError } from "@/utils/general";
import * as Yup from "yup";
import { reactive, ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import { focusOnInvalid } from "@/utils/validation";
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CSelect,
    CInput,
    CRadio,
    AgGridVue,
  },
  props: {
    transactionType: String,
    folioNumber: {
      type: Number,
      require: true,
    },
    roomNumber: {
      type: String,
      require: true,
    },
  },
  watch: {
    balanceType(val) {
      this.form.amount = 0;
      if (val == "1") {
        if (this.balance.balance > 0) {
          this.form.amount = this.balance.balance;
        }
      } else {
        if (this.balance.balance < 0) {
          this.form.amount = -this.balance.balance;
        }
      }
    },
  },
  emits: ["close"],
})
export default class TransferAccountForm extends Vue {
  public rowData: any = [];
  public transferType: number = 1;
  public form: any = reactive({
    transferMode: "1",
  });
  public options: any = {};
  public gridOptions: any = {};
  public columnDefs: any = [];
  public context: any;
  public rowSelection: string = null;
  public isSaving: boolean = false;
  folioNumber: number;
  roomNumber: string;
  gridApi: any;
  gridColumnApi: any;
  balance: any = {
    balance: 0,
    credit: 0,
    debit: 0,
  };
  public columnOptions = [
    {
      label: "folio",
      field: "number",
      width: 70,
      filter: true,
    },
    {
      label: "room",
      field: "room_number",
      width: 100,
      filter: true,
    },
    {
      label: "fullname",
      field: "full_name",
      width: 250,
      filter: true,
    },
  ];
  public formElement: any = ref(null);

  beforeMount() {
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
        width: 100,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 100,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
      },
      {
        headerName: this.$t("commons.table.subFolio"),
        field: "group_code",
        width: 70,
      },
      {
        headerName: `${this.$t("commons.table.room")}#`,
        field: "room_number",
        width: 95,
      },
      { headerName: this.$t("commons.table.account"), field: "Account" },
      {
        headerName: this.$t("commons.table.debit"),
        field: "Debit",
        width: 115,
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.credit"),
        field: "Credit",
        width: 115,
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.rowSelection = "multiple";
  }

  onGridReady() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  }
  // GENERAL FUNCTION ================================================================
  getSelectedRow() {
    const array = this.gridApi.getSelectedRows();
    const selected = array.map((result: any) => result.correction_breakdown);
    return selected;
  }

  selectAll() {
    this.gridApi.selectAll();
  }

  deselectAll() {
    this.gridApi.deselectAll();
  }

  async resetForm() {
    this.isSaving = false;
    // this.formPackageElement.resetForm();
    await this.$nextTick();
    this.form = {
      balanceType: 1,
      transferType: 1,
      amount: 0,
    };
  }

  async processTransferAccount() {
    const correctionBreakdown = this.getSelectedRow();
    if (correctionBreakdown.length > 0) {
      const selectAll = correctionBreakdown.length === this.rowData.length;
      await this.transferTransaction(
        !selectAll ? correctionBreakdown : [],
        correctionBreakdown.length === this.rowData.length
      );
    }
  }

  async initialize() {
    this.resetForm();
    this.getTransactionAccountList();
    this.getFolioBalance();
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onChangeFolioType(event: any) {
    const folioTypeCode = event.target.value;
    this.getFolioList(folioTypeCode);
  }

  async onSubmit() {
    this.isSaving = true;
    if (this.transferType == 1) {
      await this.combineTransaction();
    } else if (this.transferType == 2) {
      await this.processTransferAccount();
    } else if (this.transferType == 3) {
      await this.transferBalance();
    }
    this.isSaving = false;
  }

  onChangeTransferType() {
    if (this.transferType == 1) {
      this.form.folioType = "";
      this.form.folioNumber = "";
    }
  }

  onSave() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async getFolioList(folioTypeCode: string) {
    try {
      const { data } = await transactionAPI.getFolioListByType(folioTypeCode);
      this.options.folios = data;
    } catch (err) {
      getError(err);
    }
  }

  async getTransactionAccountList() {
    try {
      const { data } = await transactionAPI.getFolioTransactionAccount(
        this.folioNumber
      );
      this.rowData = data ? data : [];
    } catch (err) {
      getError(err);
    }
  }

  async getFolioBalance() {
    try {
      const { data } = await transactionAPI.getFolioBalance(this.folioNumber);
      this.balance = data;
      if (this.form.balanceType == "1") {
        if (data.balance > 0) {
          this.form.amount = data.balance;
        }
      } else {
        if (data.balance < 0) {
          this.form.amount = -data.balance;
        }
      }
    } catch (err) {
      getError(err);
    }
  }

  async combineTransaction() {
    try {
      const params = {
        FolioNumber: this.folioNumber,
        SubFolioGroupCode: this.form.subFolioGroupCode,
      };
      const { data } = await transactionAPI.combineTransactionToSubFolio(
        params
      );
      getToastSuccess();
      this.$emit("close");
    } catch (err) {
      getError(err);
    }
  }

  async transferTransaction(correctionBreakdown: number[], selectAll: boolean) {
    try {
      const params = {
        FolioNumber: this.folioNumber,
        SubFolioGroupCode: this.form.subFolioGroupCode,
        TransferAll: selectAll,
        CorrectionBreakdown: correctionBreakdown,
        FolioNumberTo: this.form.folioNumber,
      };
      const { data } = await transactionAPI.transferTransaction(params);
      getToastSuccess();
      this.$emit("close");
    } catch (err) {
      getError(err);
    }
  }

  async transferBalance() {
    try {
      const params = {
        SubFolioGroupCode: this.form.subFolioGroupCode,
        IsCharge: this.form.balanceType == 1,
        Amount: this.form.amount,
        RoomNumber: this.roomNumber,
        FolioNumber: this.folioNumber,
        FolioNumberTo: this.form.folioNumber,
      };
      const { data } = await transactionAPI.transferBalance(params);
      getToastSuccess();
      this.$emit("close");
    } catch (err) {
      getError(err);
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================

  mounted() {
    this.initialize();
  }

  // END RECYCLE LIFE FUNCTION ===========================================================

  get balanceType() {
    return this.form.balanceType;
  }

  get balanceDisabled() {
    return (
      (this.form.balanceType == "1" && this.balance.debit <= 0) ||
      (this.form.balanceType == "2" && this.balance.credit <= 0)
    );
  }

  get schema() {
    return Yup.object().shape({
      subFolioGroup: Yup.string().required(),
      folioType: this.transferType > 1 ? Yup.string().required() : null,
      folioNumber: this.transferType > 1 ? Yup.string().required() : null,
      amount:
        this.transferType === 3
          ? Yup.number()
              .required()
              .positive()
              .integer()
              .test((val) => val > 0)
          : null,
    });
  }
}
