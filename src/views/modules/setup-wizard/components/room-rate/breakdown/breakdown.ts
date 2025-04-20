import { Options, Vue } from "vue-class-component";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import * as Yup from "yup";
import { GridApi, GridOptions } from "ag-grid-community";
import action_gridVue from "@/components/ag_grid-framework/action_grid.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import checklistVue from "@/components/ag_grid-framework/checklist.vue";
import { formatNumber } from "@/utils/format";
import WizardRoomRateBreakdownAPI from "@/services/api/wizard/room-rate-breakdown";
import { anyToFloat, getError } from "@/utils/general";
import configStore from "@/stores/config";
import global from "@/utils/global";
const wizardRoomRateBreakdownAPI = new WizardRoomRateBreakdownAPI();

@Options({
  components: {
    CInput,
    CModal,
    AgGridVue,
    CCheckbox,
    CSelect,
    CRadio,
  },
  props: {
    roomRateCode: {
      type: String,
      required: true,
    },
    weekdayRate: {
      type: Number,
    },
  },
})
export default class Breakdown extends Vue {
  config = configStore();
  gridOptions: GridOptions = null;
  columnDefs: any = null;
  rowData: any = [];
  form: any = {};
  showForm: boolean = false;
  gridApi: GridApi;
  formElement: any = null;
  frameworkComponents: any = null;
  context: any = null;
  modeData: any = 0;
  listDropdown: any = {};
  options: any = {};
  disabledBusinessSource: boolean = true;
  roomRateCode: any;
  weekdayRate: number;
  paramsData: any;
  showConfirmation: boolean = false;

  getRowNodeId(params: any) {
    return params.id;
  }

  resetForm() {
    this.modeData = 0;
    this.formElement.resetForm();
    this.form = {
      sub_department_code: this.dvSubDepartment,
      room_rate_code: this.roomRateCode,
      charge_frequency_code: "1",
      is_amount_percent: 0,
      quantity: 1,
    };
    this.getComboList();
  }

  getRows(): any[] {
    let data: any = [];
    this.gridApi.forEachNode((node) => {
      data.push(node.data);
    });
    return data;
  }

  onChangePerPax() {
    if (this.form.per_pax == 1) {
      this.form.quantity = 1;
      this.form.max_pax = 4;
    } else {
      this.form.max_pax = 1;
    }
  }

  onChangeAccount() {
    const account = this.options.Account.filter(
      (val: any) => val.code == this.form.account_code
    );

    this.disabledBusinessSource =
      account[0].sub_group_code != global.subGroupAccount.accountPayable;
  }

  onChangeSubDepartment() {
    this.getAccountBySubDepartment(this.form.sub_department_code);
  }

  onSubmit() {
    this.form.quantity = anyToFloat(this.form.quantity);
    this.form.amount = anyToFloat(this.form.amount);
    this.form.per_pax = anyToFloat(this.form.per_pax);
    this.form.is_amount_percent = anyToFloat(this.form.is_amount_percent);
    this.form.max_pax = anyToFloat(this.form.extra_pax);
    this.form.per_pax_extra = anyToFloat(this.form.per_pax_extra);

    if (this.modeData == 0 || this.modeData == 2) {
      this.insert();
    } else {
      this.update();
    }
  }

  handleSave() {
    this.formElement.$el.requestSubmit();
  }

  handleDelete(paramsData: any) {
    this.paramsData = paramsData;
    this.showConfirmation = true;
  }

  onDelete() {
    this.delete(this.paramsData.id);
  }
  async handleEdit(paramsData: any) {
    this.modeData = 1;
    this.getComboList();
    await this.edit(paramsData.id);
    this.getAccountBySubDepartment(this.form.sub_department_code);
  }

  // API =========================================================================================
  async getList() {
    try {
      const { data } = await wizardRoomRateBreakdownAPI.getList(
        this.roomRateCode
      );
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }

  async edit(id: number) {
    try {
      const { data } = await wizardRoomRateBreakdownAPI.edit(id);
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async getComboList() {
    try {
      const { data } = await wizardRoomRateBreakdownAPI.getComboList();
      this.options = data;
    } catch (error) {
      getError(error);
    }
  }

  async getAccountBySubDepartment(code: string) {
    try {
      const { data } =
        await wizardRoomRateBreakdownAPI.getAccountBySubDepartment(code);
      this.options.Account = data;
    } catch (error) {
      getError(error);
    }
  }

  async insert() {
    try {
      await wizardRoomRateBreakdownAPI.insert(this.form);
      this.getList();
      this.resetForm();
    } catch (error) {
      getError(error);
    }
  }

  async update() {
    try {
      await wizardRoomRateBreakdownAPI.update(this.form);
      this.getList();
      this.resetForm();
    } catch (error) {
      getError(error);
    }
  }

  async delete(id: number) {
    try {
      await wizardRoomRateBreakdownAPI.delete(id);
      this.getList();
    } catch (error) {
      getError(error);
    }
  }
  // END API======================================================================================

  async beforeMount() {
    this.gridOptions = {
      actionGrid: {
        delete: true,
        edit: true,
      },
      rowHeight: this.$global.agGrid.rowHeightDefault,
      headerHeight: this.$global.agGrid.headerHeight,
    };
    this.context = { componentParent: this };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "id",
        enableRowGroup: false,
        resizable: false,
        filter: false,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        width: 100,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      // {
      //   headerName: this.$t("commons.table.outlet"),
      //   field: "OutletName",
      //   width: 150,
      // },
      // {
      //   headerName: this.$t("commons.table.product"),
      //   field: "ProductName",
      //   width: 150,
      // },
      {
        headerName: this.$t("commons.table.subDepartment"),
        field: "SubDepartment",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 160,
      },
      {
        headerName: this.$t("commons.table.businessSource"),
        field: "BusinessSource",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.isAmountPercent"),
        field: "is_amount_percent",
        width: 125,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.perPax"),
        field: "per_pax",
        width: 80,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.includeChild"),
        field: "include_child",
        width: 120,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 200,
      },
      {
        headerName: this.$t("commons.table.taxAndService"),
        field: "TaxAndService",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.frequency"),
        field: "Frequency",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.maxPax"),
        field: "max_pax",
        width: 80,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.extraPax"),
        field: "extra_pax",
        width: 90,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.perPaxExtra"),
        field: "per_pax_extra",
        width: 100,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklistRenderer",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };

    this.frameworkComponents = {
      checklistRenderer: checklistVue,
      actionGrid: action_gridVue,
    };
    this.initialize();
  }

  async initialize() {
    this.modeData = 0;
    await this.getComboList();
    this.resetForm();
    this.getAccountBySubDepartment(this.form.sub_department_code);
    if (!this.roomRateCode) return;
    this.getList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  get schema() {
    let account: any = [];
    if (this.options.Account) {
      account = this.options.Account.filter(
        (valX: any) => valX.code == this.form.account_code
      );
    }
    return Yup.object().shape({
      "Tax & Service": Yup.string().required(),
      "Charge Frequency": Yup.string().required(),
      Quantity: Yup.string().required(),
      "Sub Department": Yup.string().required(),
      "Business Source":
        account.length > 0 &&
        account[0].sub_group_code == global.subGroupAccount.accountPayable
          ? Yup.string().required()
          : null,
      Account: Yup.string().required(),
      Amount: Yup.number()
        .required()
        .test((val) =>
          this.form.is_amount_percent == 1 ? val < 100 : val < this.weekdayRate
        ),
    });
  }

  get title() {
    return (this.modeData == 1 ? "Update " : "Insert ") + " Room Type";
  }

  get dvSubDepartment() {
    return this.config.dvSubDepartment;
  }
}
