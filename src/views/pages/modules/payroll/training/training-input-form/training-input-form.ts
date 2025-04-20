import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { formatDate, formatDateTimeUTC } from "@/utils/format";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { Options, Vue } from "vue-class-component";

import Checkbox from "@/components/checkbox/checkbox.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import $global from "@/utils/global";
import { Form as CForm } from "vee-validate";
import * as Yup from "yup";

import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";

@Options({
  name: "InputForm",
  components: {
    CForm,
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
  public rowData: any = [];
  public formDetailMode: any;
  public isSave: boolean = false;

  public defaultForm: any = {};
  public form: any = reactive({});
  public formDetail: any = reactive({});
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];

  public colorForm: any = [
    { code: 0, name: "black" },
    { code: 1, name: "yellow" },
    { code: 2, name: "white" },
    { code: 3, name: "green" },
    { code: 4, name: "grey" },
    { code: 5, name: "blue" },
    { code: 6, name: "red" },
    { code: 7, name: "brown" },
  ];
  dropdownList: any = [
    {
      SubGroupName: "Cash",
      code: "100101",
      name: "Petty Cash - General Cashier",
    },
    {
      SubGroupName: "Cash",
      code: "100102",
      name: "Petty Cash - Cash Sale",
    },
    {
      SubGroupName: "Cash",
      code: "100103",
      name: "Petty Cash - FO Chasier",
    },
    {
      SubGroupName: "Cash",
      code: "100104",
      name: "Petty Cash - FB Chasier",
    },
    {
      SubGroupName: "Cash",
      code: "100105",
      name: "Petty Cash - Purchase",
    },
    {
      SubGroupName: "Cash",
      code: "100106",
      name: "Petty Cash - Cash US Dollar",
    },
    {
      SubGroupName: "Cash",
      code: "100108",
      name: "Petty Cash - Cash Australian Dollar",
    },
    {
      SubGroupName: "Cash",
      code: "100201",
      name: "Bank A",
    },
    {
      SubGroupName: "Cash",
      code: "100202",
      name: "Bank B",
    },
    {
      SubGroupName: "Cash",
      code: "100203",
      name: "Bank C",
    },
    {
      SubGroupName: "Cash",
      code: "100204",
      name: "Bank D",
    },
    {
      SubGroupName: "Cash",
      code: "100205",
      name: "Bank E",
    },
    {
      SubGroupName: "Cash",
      code: "100901",
      name: "Undistributed Fund Debit",
    },
    {
      SubGroupName: "Cash",
      code: "100902",
      name: "Undistributed Fund Credit",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "110101",
      name: "Guest Ledger",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "110102",
      name: "Personal Ledger",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "110103",
      name: "City Ledger",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "110104",
      name: "Credit Card",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "110105",
      name: "Employee Ledger",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "110106",
      name: "Travel Agent Ledger",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "120301",
      name: "Affiliated Company",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "120398",
      name: "Prive",
    },
    {
      SubGroupName: "Guest & City Ledger",
      code: "120399",
      name: "Provision for Doubtful Debt",
    },
    {
      SubGroupName: "Cash",
      code: "123456789012345",
      name: "AAAAAAAAA",
    },
    {
      SubGroupName: "Inventories",
      code: "130101",
      name: "INV-Food",
    },
    {
      SubGroupName: "Inventories",
      code: "130201",
      name: "INV-Beverage",
    },
    {
      SubGroupName: "Inventories",
      code: "130301",
      name: "INV- Mini Bar",
    },
    {
      SubGroupName: "Inventories",
      code: "130311",
      name: "INV-Drugstore",
    },
    {
      SubGroupName: "Inventories",
      code: "130401",
      name: "INV-Guest Supplies",
    },
    {
      SubGroupName: "Inventories",
      code: "130402",
      name: "INV-Cleaning Supplies",
    },
    {
      SubGroupName: "Inventories",
      code: "130403",
      name: "INV-Printing Supplies",
    },
  ];

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

  columnOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "200",
    },
    {
      field: "code",
      label: "code",
      align: "right",
      format: "number",
      width: "100",
    },
  ];
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
    this.form = {
      is_lost: 1,
      value: 1000,
      is_return: 0,
      color: "100101|100102",
      date_posting: formatDateTimeUTC(new Date()),
    };
  }

  initialize() {
    this.resetForm();
    this.gridFormReset();
  }

  onSubmit() {
    this.inputFormValidation.$el.requestSubmit();
  }

  onSave() {
    this.$emit("save", this.form);
  }

  checkForm() {
    console.log(this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      Item: Yup.string().required(),
      Date: Yup.string().required(),
      // Value: Yup.number().required().test((val: number) => val <= this.form.value2),
      Value2: Yup.number().required(),
    });
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

  get disabledActionGrid() {
    return this.isSave;
  }

  insertDataGrid() {
    // this.formDetail.Cod/e

    this.gridApi.applyTransaction({
      add: [this.formDetail],
    });
    this.gridFormReset();
  }

  handleEdit(params: any) {
    this.formDetail = params;
    console.log(params);
    this.isSave = true;
    // this.gridHidden()
  }

  handleSaveGrid() {
    if (this.isSave) {
      this.updateDataGrid();
    } else {
      this.insertDataGrid();
    }
  }

  getRowNodeId(params: any) {
    return params.Code;
  }

  updateDataGrid() {
    this.gridApi.applyTransaction({
      update: [this.formDetail],
    });
    this.gridFormReset();
  }
  handleDelete(params: any) {
    this.gridApi.applyTransaction({
      remove: [params],
    });
    this.gridFormReset();
  }
  gridFormCancel() {
    this.gridFormReset();
    this.isSave = false;
  }
  gridFormReset() {
    this.formDetail = {
      code: null,
      name: "",
      Nominal: 0,
      Tanggal: formatDateTimeUTC(new Date()),
    };
    this.isSave = false;
  }

  // gridHidden() {
  //   this.gridOptions.columnApi.setColumnsVisible('Code', false)
  // }

  cellValueChanged(event: any) {
    console.log(event);
    if (
      (event.data.Nominal2 > event.data.Nominal &&
        event.colDef.field == "Nominal2") ||
      (event.data.Name.length >= 5 && event.colDef.field == "Name")
    ) {
      event.node.setDataValue(event.colDef.field, event.oldValue);
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
      { headerName: this.$t("commons.table.code"), field: "Code", width: 100 },
      {
        headerName: this.$t("commons.table.name"),
        field: "Name",
        editable: true,
        width: 140,
      },
      { headerName: "Nominal", field: "Nominal", width: 140 },
      {
        headerName: "Nominal 2",
        field: "Nominal2",
        width: 140,
        editable: true,
      },
      {
        headerName: "Tanggal",
        field: "Tanggal",
        width: 100,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
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
}
