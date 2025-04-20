import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";

import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateTotalFooterAgGrid,
  getError,
  anyToFloat,
  cloneObject,
  generateIconContextMenuAgGrid,
} from "@/utils/general";
import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CDialog from "@/components/dialog/dialog.vue";
import $global from "@/utils/global";
import { Form } from "vee-validate";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ARCityLedgerFolioList from "@/services/api/accounting/folio";
import { reactive, ref } from "vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import {
  formatNumber,
  formatDate,
  formatDateTimeUTC,
  formatDateDatabase,
} from "@/utils/format";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import ARCityledgerInvoice from "@/services/api/accounting/ar-city-ledger-invoice";
import configStore from "@/stores/config";
import { getToastInfo } from "@/utils/toast";
const arCityLedgerFolioList = new ARCityLedgerFolioList();
const arCityledgerInvoice = new ARCityledgerInvoice();

@Options({
  name: "Folio",
  components: {
    Form,
    CSelect,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
    CDialog,
  },
  emits: ["setFolioData"],
  props: ["params"],
})
export default class Folio extends Vue {
  private config = configStore();
  public params: any;
  public rowData: any = [];
  id: any = 0;
  indexIdToUpdate: any;
  public isSave: boolean = false;
  public form: any = reactive({});
  public companyCombolist: any = [{}];
  public code: string = null;
  public folioFormValidation: any = ref();
  // public showForm: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  deleteCode: any = "";
  dataUpdate: any;
  listDropdownCurrency = {};
  listDropdownFolio: any = [{}];
  searchOptions: any = [];
  detailRowAutoHeight: boolean = true;
  setAmountChargeFLabel: any = "";
  isExistFolio: boolean = false;
  CompanyCode: string = "";
  InvoiceNumber: string = "";
  columnFolioOptions = [
    {
      label: "folioNumber",
      field: "folio_number",
      align: "left",
      width: "30",
      filter: true,
    },
    {
      label: "auditDate",
      field: "audit_date",
      align: "center",
      width: "80",
      format: "date",
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
      label: "name",
      field: "GuestName",
      align: "left",
      width: "130",
      filter: true,
    },
    {
      label: "amount",
      field: "Amount",
      align: "right",
      width: "150",
      format: "number",
      filter: true,
    },
  ];

  // Ag grid variable
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
  folioNumber: any;
  global: any;

  async initialize() {
    await this.resetFormFolio();
    await this.resetDataGridDetail();
  }

  loadAllDropdown() {
    this.loadCurrency();
    this.loadFolio(this.CompanyCode, this.InvoiceNumber);
  }

  gridFormCancel() {
    this.resetFormFolio();
    this.isSave = false;
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  async resetDataGridDetail() {
    await this.$nextTick();
    this.rowData = [];
  }

  onChangeFolioNumber(event: any) {
    const folio_number = event.target.value;
    this.setDataFormFolio(folio_number);
    this.setAmountCharge();
  }

  setAmountCharge() {
    if (this.form.exchange_rate && this.form.amountChargeF) {
      this.form.amount_charged =
        this.form.exchange_rate * this.form.amountChargeF;
    }
  }

  onChangeCurrencyCode(event: any) {
    const currency = event.target.value;
    this.setAmountChargeFLabel = this.$t(`labels.amount${currency}`);
    const currencyExcangeRate: any = this.listDropdownCurrency;
    for (const i of currencyExcangeRate) {
      if (i.code === currency) {
        this.form.exchange_rate = anyToFloat(i.exchange_rate);
        this.form.amountChargeF = 0;
        this.form.amount_charged = 0;
      }
    }
    this.setAmountCharge();
  }

  editData(param: any) {
    const data = cloneObject(param);
    this.form = data;
  }

  getRowData() {
    let rowData: any = [];
    this.gridApi.forEachNode(function (node: any) {
      rowData.push(node.data);
    });
    return rowData;
  }

  setFolioList() {
    const data = this.getRowData();
    const arr: any = [];
    data.map((val: any) => {
      val.Amount = anyToFloat(val.Amount);
      val.AmountCharged = anyToFloat(val.AmountCharged);
      val.AmountChargedForeign = anyToFloat(val.AmountChargedForeign);
      val.amount_charged_foreign = anyToFloat(val.amount_charged_foreign);
      val.amount = anyToFloat(val.amount);
      val.amountChargeF = anyToFloat(val.amountChargeF);
      val.amount_charged = anyToFloat(val.amount_charged);
      val.exchange_rate = anyToFloat(val.exchange_rate);
      arr.push(val);
    });

    return arr;
  }

  onSubmit() {
    this.folioFormValidation.$el.requestSubmit();
  }

  async resetFormFolio() {
    this.folioFormValidation.resetForm();
    await this.$nextTick();
    this.isSave = false;
    this.form = {
      currency_code: this.defaultCurrency,
      exchange_rate: 1,
    };
  }

  async handleSave() {
    if (!this.isSave) {
      this.insertData();
    } else if (this.isSave) {
      await this.handleUpdate();
    }
  }

  // applyTransaction
  changeGridOnUpdate() {
    this.rowData = this.getRowData();
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
  }

  getDataGrid(params: any) {
    this.handleInsert(params);
  }

  insertData() {
    let increment = this.id + 1;
    this.id = increment;
    let formData: any = {
      Amount: anyToFloat(this.form.amount),
      amount: anyToFloat(this.form.amount),
      exchange_rate: anyToFloat(this.form.exchange_rate),
      amountChargeF: anyToFloat(this.form.amountChargeF),
      amount_charged: anyToFloat(this.form.amount_charged),
      audit_date: formatDateTimeUTC(this.form.audit_date),
      curr: this.form.curr,
      GuestName: this.form.GuestName,
      room_number: this.form.room_number,
      folio_number: this.form.folio_number,
      currency_code: this.form.currency_code,
      remark: this.form.remark,
      index_id: increment,
    };

    const rowData = this.getRowData();
    const exist = rowData.find(
      (val: any) => val.folio_number == formData.folio_number
    );
    if (exist) {
      getToastInfo("Already Exist!");
      return;
    }

    this.handleInsert([formData]);
    this.resetFormFolio();
  }

  handleInsert(formData: any) {
    this.gridApi.applyTransaction({
      add: formData,
    });
  }

  handleDelete(params: any) {
    this.gridApi.applyTransaction({ remove: [params] });
  }

  handleEdit(params: any) {
    this.indexIdToUpdate = params.index_id;
    this.editData(params);
    this.isSave = true;
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

  getRowNodeId(params: any) {
    return params.index_id;
  }

  handleUpdate() {
    let param = {
      Amount: anyToFloat(this.form.amount),
      amount: anyToFloat(this.form.amount),
      exchange_rate: anyToFloat(this.form.exchange_rate),
      amountChargeF: anyToFloat(this.form.amountChargeF),
      amount_charged: anyToFloat(this.form.amount_charged),
      audit_date: formatDateTimeUTC(this.form.audit_date),
      curr: this.form.curr,
      GuestName: this.form.GuestName,
      room_number: this.form.room_number,
      folio_number: this.form.folio_number,
      currency_code: this.form.currency_code,
      remark: this.form.remark,
      index_id: this.indexIdToUpdate,
    };

    const rowData = this.getRowData();
    const cloneRowData = cloneObject(rowData, true);
    for (const i in cloneRowData) {
      if (
        param.folio_number == cloneRowData[i].folio_number &&
        param.index_id != cloneRowData[i].index_id
      ) {
        getToastInfo("Already Exist!");
        this.isSave = true;
        return;
      }
    }

    this.gridApi.applyTransaction({
      update: [param],
    });
    this.resetFormFolio();
    this.isSave = false;
  }

  async setDataFormFolio(folio_number: string) {
    const folioList = this.listDropdownFolio;

    for (const i of folioList) {
      if (i.folio_number == folio_number) {
        this.form.amount = i.Amount;
        this.form.amountChargeF = i.Amount;
        this.form.audit_date = formatDateDatabase(i.audit_date);
        this.form.room_number = i.room_number;
        this.form.currency_code = "IDR";
        this.form.GuestName = i.GuestName;
      }
    }
    this.setAmountChargeFLabel = this.$t(
      `labels.amount${this.form.currency_code}`
    );
  }

  async loadCurrency() {
    try {
      const params = ["Currency"];
      const { data } =
        await arCityledgerInvoice.GetARCityLedgerPaymentComboList(params);
      this.listDropdownCurrency = data.Currency;
    } catch (error) {
      getError(error);
    }
  }

  async loadFolio(companyCode: string, invoiceNumber: string) {
    try {
      let params = {
        DirectBillCode: companyCode,
        InvoiceNumber: invoiceNumber,
      };
      const { data } = await arCityLedgerFolioList.ARCityLedgerFolioList(
        params.DirectBillCode,
        params.InvoiceNumber
      );

      this.listDropdownFolio = data;
    } catch (error) {}
  }

  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.type"), value: 2 },
      { text: this.$t("commons.filter.createdBy"), value: 3 },
      { text: this.$t("commons.filter.updatedBy"), value: 4 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        insert: false,
        correction: false,
        void: false,
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };

    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "index_id",
        width: 90,
        suppressMenu: true,
        cellRenderer: "actionGrid",
        colId: "params",
        cellStyle: { textAlign: "center" },
      },
      {
        headerName: this.$t("commons.table.folioNumber"),
        field: "folio_number",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.roomNumber"),
        field: "room_number",
        width: 110,
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 100,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.guestName"),
        field: "GuestName",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        sumTotal: true,
        width: 100,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
      },
      {
        headerName: this.$t("commons.table.amountCharged"),
        field: "amount_charged",
        sumTotal: true,
        width: 130,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
      },
      { headerName: this.$t("commons.table.curr"), field: "curr", width: 50 },
      {
        headerName: this.$t("commons.table.amountChargedF"),
        field: "amountChargeF",
        sumTotal: true,
        width: 150,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
      },
      {
        headerName: this.$t("commons.table.fCurr"),
        field: "currency_code",
        width: 60,
      },
      {
        headerName: this.$t("commons.table.exchangeRate"),
        field: "exchange_rate",
        sumTotal: true,
        width: 120,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 100,
      },
    ];

    this.context = { componentParent: this };
    this.detailRowAutoHeight = true;
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
    this.rowModelType = "serverSide";
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
    this.ColumnApi = this.gridOptions.columnApi;
    this.loadCurrency();
    this.resetFormFolio();
  }

  get schema() {
    return Yup.object().shape({
      folio_number: Yup.string().required(),
      amount: Yup.string().required(),
      audit_date: Yup.string().required(),
      currency_code: Yup.string().required().min(1),
      exchange_rate: Yup.string().required(),
      amountChargeF: Yup.string().required(),
      amount_charged: Yup.string().required(),
      remark: Yup.string(),
    });
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t("labels.folio")}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t("labels.folio")}`;
    }
  }

  get disabledActionGrid() {
    return this.isSave;
  }

  get defaultCurrency() {
    return this.config.defaultCurrency;
  }

  // get auditDate() {
  //   return this.config.auditDate;
  // }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }
}
