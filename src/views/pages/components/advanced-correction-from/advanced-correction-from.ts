import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
// import CRad
import * as Yup from "yup";
import { AgGridVue } from "ag-grid-vue3";
import TransactionAPI from "@/services/api/transaction";
import checkboxEditor from "@/components/ag_grid-framework/checkbox_editor.vue";
import checkboxRenderer from "@/components/ag_grid-framework/checkbox.vue";
// import CheckLi
import {
  anyToFloat,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import { getToastError, getToastInfo, getToastSuccess } from "@/utils/toast";
import { formatDate3, formatNumber } from "@/utils/format";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import AdvancedCorrectionAPI from "@/services/api/transaction/advanced_correction";
import "ag-grid-enterprise";
const advancedCorrectionAPI = new AdvancedCorrectionAPI();

interface ICredential {
  userId: string;
  reason: string;
}

@Options({
  components: {
    CInput,
    AgGridVue,
    CRadio,
  },
  props: {
    isDeposit: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      require: true,
    },
    reason: {
      type: String,
      require: true,
    },
    credential: {
      type: Object as () => ICredential,
      require: true,
    },
  },
  emits: ["close", "save"],
})
export default class AdvancedCorrectionForm extends Vue {
  public ID: number;
  public titleID: number;
  public credential: any;
  public inputForm: any = null;
  public isDeposit: boolean;
  amountBefore: number = 0;
  quantityBefore: number = 0;
  public form: any = {
    amount_before: 0,
    quantity_before: 0,
    transaction_date: "",
    sub_department_code: "",
    account: "",
    type: "",
    amount: 0,
    by_amount: true,
    is_fixed: 0,
    quantity: 1,
  };
  rowData: any = [];
  isSaving: boolean = false;
  paginationPageSize: any;
  rowSelection: string;
  rowModelType: string;
  bottomRowTotal: any;
  total: any;
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
  gridOptions: any;
  detailCellRenderer: any;
  columnDefs: any = null;
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any;
  limitPageSize: any;
  gridApi: any;
  paramsData: any;
  ColumnApi: any;
  agGridSetting: any = null;
  gridColumnApi: any;
  columnTypes: any;
  data: any;
  totalAmountAfter: any;
  changed: boolean = false;

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  getRowData(params: any) {
    let rowData: any = [];
    let amountChange = 0;
    let totalNotChange = 0;
    this.gridApi.forEachNode(function (node: any) {
      const data = node.data;
      if (params.data.id == data.id) {
        data.is_changed = true;
        if (isNaN(data.amount)) {
          data.amount = 0;
        }

        amountChange = anyToFloat(data.amount_before) - anyToFloat(data.amount);
      } else {
        if (data.is_fixed) {
          data.is_changed = true;
        } else {
          data.is_changed = false;
          totalNotChange += anyToFloat(data.amount_before) ?? 0;
        }
      }

      rowData.push({
        account: data.account,
        sub_department: data.sub_department,
        amount: anyToFloat(data.amount),
        amount_before: anyToFloat(data.amount_before),
        account_code: data.account_code,
        id: data.id,
        breakdown1: data.breakdown1,
        breakdown2: data.breakdown2,
        is_changed: data.is_changed,
        is_fixed: data.is_fixed,
      });
    });

    this.totalAmountAfter = 0;
    for (const i in rowData) {
      if (this.form.is_fixed == 1) {
        if (!rowData[i].is_changed) {
          const percent = (
            (rowData[i].amount_before / totalNotChange) *
            100
          ).toFixed(2);
          const percentAmount = (anyToFloat(percent) * amountChange) / 100;
          let amount =
            anyToFloat(rowData[i].amount_before) + anyToFloat(percentAmount);
          if (amount < 0) {
            amount = 0;
          }
          rowData[i].amount = amount;
        } else {
        }
      }

      if (rowData[i].amount_before != rowData[i].amount) {
        this.changed = true;
      }
      this.totalAmountAfter += anyToFloat(rowData[i].amount);
    }

    return rowData;
  }

  regenerateData(params: any) {
    this.rowData = this.getRowData(params);
  }

  cellValueChanged(params: any) {
    if (params.value === true || params.value === false) return;
    this.regenerateData(params);
  }

  handleReset() {
    this.getAdvancedCorrection();
  }

  async handleSave() {
    if (this.isSaving) return;
    if (!this.changed) {
      getToastInfo("Please change correction data");
      return;
    }
    if (
      this.form.is_fixed == 1 &&
      this.form.amount_before != this.totalAmountAfter
    ) {
      getToastError("Total amount is not equal with initial amount!");
      return;
    }
    this.isSaving = true;
    await this.processAdvancedCorrection();
    this.isSaving = false;
  }

  // API=======================================================
  async getAdvancedCorrection() {
    try {
      const { data } = await advancedCorrectionAPI.getAdvancedCorrection(
        this.data.breakdown1
      );
      this.changed = false;
      this.form = {
        audit_date: formatDate3(data.audit_date),
        amount_before: data.total_amount,
        is_fixed: 1,
      };
      this.rowData = data.detail;
      this.totalAmountAfter = data.total_amount;
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    } catch (err) {
      getError(err);
    }
  }

  async processAdvancedCorrection() {
    const params = {
      breakdown1: this.data.breakdown1,
      reason: this.credential.reason,
      correction_by: this.credential.userId,
      sub_folio_id: this.data.id,
      detail: this.rowData,
    };
    try {
      await advancedCorrectionAPI.processAdvancedCorrection(params);
      this.$emit("save");
      getToastSuccess();
    } catch (err) {
      getError(err);
    }
  }
  // END API===================================================

  async beforeMount() {
    this.agGridSetting = this.$global.agGrid;
    this.gridOptions = {
      ...this.$global.agGrid.defaultGridOptions,
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "sub_department",
        width: 170,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "account",
        width: 300,
      },
      {
        headerName: this.$t("commons.table.amountBefore"),
        field: "amount_before",
        width: 150,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        type: "numericColumn",
        sumTotal: true,
      },
      {
        headerName: this.$t("transaction.table.amount"),
        field: "amount",
        width: 150,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
        editable: true,
        singleClickEdit: true,
      },
      {
        headerName: this.$t("commons.table.fixedAmount"),
        field: "is_fixed",
        width: 170,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checkboxRenderer",
        cellEditor: "checkboxEditor",
        editable: true,
        singleClickEdit: true,
      },
    ];

    this.context = { componentParent: this };
    this.frameworkComponents = {
      // actionGrid: ActionGrid,
      // iconLockRenderer: IconLockRenderer,
      checkboxRenderer: checkboxRenderer,
      checkboxEditor: checkboxEditor,
    };
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
    await this.getAdvancedCorrection();
    setInputFocus();
  }

  onGridReady() {
    this.gridApi = this.gridOptions.api;
  }

  get title() {
    return `${this.$t("title.advancedCorrectionForId")} ${this.data.id}`;
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      amount: this.form.by_amount
        ? Yup.number()
            .min(0)
            .required()
            .test((val) => {
              return (
                val > this.form.amount_before || val < this.form.amount_before
              );
            })
        : null,
      quantity: !this.form.by_amount
        ? Yup.number()
            .min(0)
            .required()
            .test((val) => {
              return (
                val > this.form.quantity_before ||
                val < this.form.quantity_before
              );
            })
        : null,
    });
  }
}
