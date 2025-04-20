import { Options, Vue } from "vue-class-component";
import Select from "@/components/select/select.vue";
import { BFormRadio } from "bootstrap-vue-3";

import { AgGridVue } from "ag-grid-vue3";
import $global from "@/utils/global";
import { focusOnInvalid } from "@/utils/validation";
import { getError } from "@/utils/general";
import TransactionAPI from "@/services/api/transaction";
import { Form } from "vee-validate";
import { getToastSuccess, getToastError } from "@/utils/toast";
import * as Yup from "yup";
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    BFormRadio,
    Form,
    Select,
    AgGridVue,
  },
  props: {
    transactionType: String,
    folioNumber: {
      type: Number,
      require: true,
    },
  },
  emits: ["close", "save"],
})
export default class ReturnTransferForm extends Vue {
  public rowData: any = [];
  public form: any = {
    returnType: "1",
    subFolioGroup: "A",
  };
  public options: any = {};
  gridOptions: any = {};
  global: any;
  columnDefs: any = [];
  context: any;
  rowSelection: string = null;
  rowModelType: string;
  gridApi: any;
  gridColumnApi: any;
  isSaving: boolean = false;
  formElement: any = null;
  folioNumber: number;

  beforeMount() {
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("transaction.table.folioNumber"),
        field: "number",
        width: 150,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      {
        headerName: this.$t("transaction.table.roomNumber"),
        field: "room_number",
        width: 150,
      },
      {
        headerName: this.$t("transaction.table.fullName"),
        field: "FullName",
        width: 300,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
  }

  // GENERAL FUNCTION ================================================================
  async resetForm() {
    this.isSaving = false;
    await this.$nextTick();
    this.form = {
      sub_folio_group_code: "A",
      return_type: 1,
    };
  }

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  onSave() {
    this.formElement.$el.requestSubmit();
  }

  async onSubmit() {
    let rowData: any = this.gridApi.getSelectedRows();
    if (rowData.length <= 0) {
      return getToastError(this.$t("messages.selectAccount"));
    }
    this.isSaving = true;
    rowData = rowData.map((val: { number: any }) => val.number);
    await this.returnTransfer(rowData);
    this.isSaving = false;
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async getFolioReturnTransaction() {
    try {
      const { data } = await transactionAPI.getFolioReturns(this.folioNumber);
      this.rowData = data;
    } catch (err) {
      getError(err);
    }
  }

  async returnTransfer(folioNumberList: any) {
    try {
      if (!this.folioNumber) return;
      const params = {
        folio_number: this.folioNumber,
        folio_number_list: folioNumberList,
        ...this.form,
      };
      const { data } = await transactionAPI.returnTransfer(params);
      getToastSuccess();
      this.$emit("close");
    } catch (err) {
      getError(err);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.getFolioReturnTransaction();
    this.resetForm();
  }
  // END RECYCLE LIFE FUNCTION ===========================================================

  get schema() {
    return Yup.object().shape({
      subFolioGroupCode: Yup.string().required(),
    });
  }
}
