import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { BCard, BTabs, BTab, BCardText } from "bootstrap-vue-3";
import authModule from "@/stores/auth";
import UserSettingAPI from "@/services/api/general/user-setting";
import $global from "@/utils/global";
import { onSelectContextMenu } from "@/utils/context-menu";
import { calculateDataForDisplay } from "@/utils/general";
const userSettingAPI = new UserSettingAPI();

@Options({
  name: "access_group_accounting",
  components: {
    // TransferForm,
    BCardText,
    BCard,
    BTabs,
    BTab,
    Form,
    CRadio,
    CSelect,
    CInput,
    CCheckbox,
    CDatepicker,
    AgGridVue,
  },
  props: { editData: Object },
  emits: ["save", "close"],
})
export default class AccessGroupAccounting extends Vue {
  public auth = authModule();
  public access: any = {
    access_form: [],
    access_invoice: [],
    access_special: [],
    print_invoice_count: 1,
  };
  public accessList = {
    access_form: [
      {
        code: $global.accountingAccessOrder.accessForm.folioAndTransaction,
        name: "Accounting - Folio and Transaction",
        hidden: true,
      },
      {
        code: $global.accountingAccessOrder.accessForm.folioHistory,
        name: "Accounting - Folio History",
        hidden: true,
      },
      {
        code: $global.accountingAccessOrder.accessForm.receive,
        name: "Accounting - Receive",
      },
      {
        code: $global.accountingAccessOrder.accessForm.payment,
        name: "Accounting - Payment",
      },
      {
        code: $global.accountingAccessOrder.accessForm.prepaidExpense,
        name: "Accounting - Prepaid Expense",
      },
      {
        code: $global.accountingAccessOrder.accessForm.differedIncome,
        name: "Accounting - Differed Income",
      },
      {
        code: $global.accountingAccessOrder.accessForm.receipt,
        name: "Accounting - Receipt",
      },
      {
        code: $global.accountingAccessOrder.accessForm.cheque,
        name: "Accounting - Cheque",
        hidden: true,
      },
      {
        code: $global.accountingAccessOrder.accessForm.journal,
        name: "Accounting - Journal",
      },
      {
        code: $global.accountingAccessOrder.accessForm.incomeBudget,
        name: "Accounting - Income Budget",
      },
      {
        code: $global.accountingAccessOrder.accessForm.expenseBudget,
        name: "Accounting - Expense Budget",
      },
      {
        code: $global.accountingAccessOrder.accessForm.statisticBudget,
        name: "Accounting - Statistic Budget",
      },
      {
        code: $global.accountingAccessOrder.accessForm.manPowerBudget,
        name: "Accounting - Manpower",
        hidden: true,
      },
      {
        code: $global.accountingAccessOrder.accessForm.closeMonth,
        name: "Accounting - Close Month",
      },
      {
        code: $global.accountingAccessOrder.accessForm.closeYear,
        name: "Accounting - Close Year",
      },
      {
        code: $global.accountingAccessOrder.accessForm.dataAnalysis,
        name: "Accounting - Data Analysis",
        hidden: true,
      },
      {
        code: $global.accountingAccessOrder.accessForm.accountPayable,
        name: "Account Payable - Account Payable",
      },
      {
        code: $global.accountingAccessOrder.accessForm.apRefundDeposit,
        name: "Account Payable - AP Refund Deposit",
      },
      {
        code: $global.accountingAccessOrder.accessForm.apCommission,
        name: "Account Payable - AP Commission",
      },
      {
        code: $global.accountingAccessOrder.accessForm.accountReceivable,
        name: "Account Receivable - Account Receivable",
      },
      {
        code: $global.accountingAccessOrder.accessForm.arCityLedger,
        name: "Account Receivable - AR City Ledger",
      },
      {
        code: $global.accountingAccessOrder.accessForm.arCityLedgerInvoice,
        name: "Account Receivable - AR City Ledger Invoice",
      },
      {
        code: $global.accountingAccessOrder.accessForm.bankTransaction,
        name: "Account Receivable - Bank Transaction",
      },
      {
        code: $global.accountingAccessOrder.accessForm.bankReconciliation,
        name: "Account Receivable - Bank Reconciliation",
      },
      {
        code: $global.accountingAccessOrder.accessForm.cashReconciliation,
        name: "Account Receivable - Cash Reconciliation",
      },
      {
        code: $global.accountingAccessOrder.accessForm.journalNotBalance,
        name: "Auditor - Journal Not Balance",
      },
      {
        code: $global.accountingAccessOrder.accessForm.unsuccessfulExportJournal,
        name: "Auditor - unsuccessful Export Journal",
      },
      {
        code: $global.accountingAccessOrder.accessForm.foreignCash,
        name: "Account Receivable - Foreign Cash",
        hidden: true,
      },
      {
        code: $global.accountingAccessOrder.accessForm.auditTool,
        name: "Auditor - Audit Tool",
        hidden: true,
      },
      {
        code: $global.accountingAccessOrder.accessForm.sourceData,
        name: "Auditor - Source Data",
        hidden: true,
      },
    ],
    access_special: [
      {
        code: $global.accountingAccessOrder.accessSpecial.modifyClosedJournal,
        name: "Modify Closed Journal",
      },
      {
        code: $global.accountingAccessOrder.accessSpecial.printInvoiceMoreThan,
        name: "Print Invoice More Than",
      },
    ],
    access_invoice: [
      {
        code: $global.accountingAccessOrder.accessInvoice.insert,
        name: "Insert",
      },
      {
        code: $global.accountingAccessOrder.accessInvoice.update,
        name: "Update",
      },
      {
        code: $global.accountingAccessOrder.accessInvoice.delete,
        name: "Delete",
      },
      {
        code: $global.accountingAccessOrder.accessInvoice.insertPayment,
        name: "Insert Payment",
      },
      {
        code: $global.accountingAccessOrder.accessInvoice.deletePayment,
        name: "Delete Payment",
      },
      {
        code: $global.accountingAccessOrder.accessInvoice.printReceipt,
        name: "Print Receipt",
      },
      {
        code: $global.accountingAccessOrder.accessInvoice.exchangeRate,
        name: "Exchange Rate",
      },
      {
        code: $global.accountingAccessOrder.accessInvoice.paymentByApAr,
        name: "Payment by AP/AR",
      },
    ],
  };
  editData: any;

  handleSave() { }

  calculateDataForDisplay(data: any[]) {
    return calculateDataForDisplay(data, this.columnSize);
  }

  async getAccessForm(access: any) {
    if (!access) return;
    for (const i in access) {
      if (i == "print_invoice_count") {
        this.access.print_invoice_count = access.print_invoice_count;
      }
      for (let x = 0; x < access[i].length; x++) {
        if (this.access.hasOwnProperty(i)) {
          this.access[i][x] = parseInt(access[i][x]);
        }
      }
    }
  }

  getModelIndex(data: any, columnIndex: number, currentIndex: number) {
    const rowCount = Math.ceil(data.length / this.columnSize);
    return rowCount * columnIndex + currentIndex;
  }

  onContextMenu(e: MouseEvent, access: number[], list: object[]) {
    onSelectContextMenu(this, e, access, list);
  }

  // API CALL=============================================================================
  // END API CALL=========================================================================

  beforeMount(): void { }
  mounted(): void { }

  get screenSize() {
    return this.$store.getters["ui/screenSize"];
  }

  get columnSize() {
    if (this.screenSize == "lg") {
      return 4;
    }
    if (this.screenSize == "md") {
      return 2;
    }
    if (this.screenSize == "sm") {
      return 2;
    }
    if (this.screenSize == "xs") {
      return 1;
    }
    return 1;
  }
}
