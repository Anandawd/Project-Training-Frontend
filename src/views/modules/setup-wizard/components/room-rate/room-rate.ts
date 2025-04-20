import { Options, Vue } from "vue-class-component";
import "vue3-form-wizard/dist/style.css";
import CInput from "@/components/input/input.vue";
import { AgGridVue } from "ag-grid-vue3";
import CModal from "@/components/modal/modal.vue";
import * as Yup from "yup";
import { GridApi, GridOptions } from "ag-grid-community";
import action_gridVue from "@/components/ag_grid-framework/action_grid.vue";
import { getToastError, getToastInfo } from "@/utils/toast";
import {
  formatDate,
  formatDateDatabase,
  formatDateTimeZeroUTC,
  formatNumber,
} from "@/utils/format";
import checklistVue from "@/components/ag_grid-framework/checklist.vue";
import { BTab, BCardText, BTabs } from "bootstrap-vue-3";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CSelect from "@/components/select/select.vue";
import { anyToFloat, copyValueDoubleClick, getError } from "@/utils/general";
import Breakdown from "./breakdown/breakdown.vue";
import configStore from "@/stores/config";
import WizardRoomRateAPI from "@/services/api/wizard/room-rate";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { focusOnInvalid } from "@/utils/validation";
const wizardRoomRateAPI = new WizardRoomRateAPI();

@Options({
  components: {
    CInput,
    CModal,
    AgGridVue,
    BTab,
    BCardText,
    BTabs,
    CCheckbox,
    CSelect,
    Breakdown,
    CDatepicker,
  },
  props: {},
})
export default class RoomRate extends Vue {
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
  modeData: any = null;
  detailCellRenderer: string;
  listDropdown: any = {};
  isFlat: boolean = true;
  paramsData: any;
  showConfirmation: boolean = false;
  options: any = {};
  tabIndex: number = 0;

  onChangeIsFlat() {
    if (this.isFlat) {
      this.form.weekday_rate2 = anyToFloat(this.form.weekday_rate1);
      this.form.weekday_rate3 = anyToFloat(this.form.weekday_rate1);
      this.form.weekday_rate4 = anyToFloat(this.form.weekday_rate1);

      this.form.weekend_rate2 = anyToFloat(this.form.weekend_rate1);
      this.form.weekend_rate3 = anyToFloat(this.form.weekend_rate1);
      this.form.weekend_rate4 = anyToFloat(this.form.weekend_rate1);

      this.form.weekday_rate_child2 = anyToFloat(this.form.weekday_rate_child1);
      this.form.weekday_rate_child3 = anyToFloat(this.form.weekday_rate_child1);
      this.form.weekday_rate_child4 = anyToFloat(this.form.weekday_rate_child1);

      this.form.weekend_rate_child2 = anyToFloat(this.form.weekend_rate_child1);
      this.form.weekend_rate_child3 = anyToFloat(this.form.weekend_rate_child1);
      this.form.weekend_rate_child4 = anyToFloat(this.form.weekend_rate_child1);
    }
  }

  onChangeWeekdayRate(isChildRate: boolean) {
    if (this.isFlat) {
      if (isChildRate) {
        this.form.weekday_rate_child2 = anyToFloat(
          this.form.weekday_rate_child1
        );
        this.form.weekday_rate_child3 = anyToFloat(
          this.form.weekday_rate_child1
        );
        this.form.weekday_rate_child4 = anyToFloat(
          this.form.weekday_rate_child1
        );
      } else {
        this.form.weekday_rate2 = anyToFloat(this.form.weekday_rate1);
        this.form.weekday_rate3 = anyToFloat(this.form.weekday_rate1);
        this.form.weekday_rate4 = anyToFloat(this.form.weekday_rate1);
      }

      if (isChildRate) {
        this.form.weekend_rate_child1 = anyToFloat(
          this.form.weekday_rate_child1
        );
        this.form.weekend_rate_child2 = anyToFloat(
          this.form.weekday_rate_child1
        );
        this.form.weekend_rate_child3 = anyToFloat(
          this.form.weekday_rate_child1
        );
        this.form.weekend_rate_child4 = anyToFloat(
          this.form.weekday_rate_child1
        );
      } else {
        this.form.weekend_rate1 = anyToFloat(this.form.weekday_rate1);
        this.form.weekend_rate2 = anyToFloat(this.form.weekday_rate1);
        this.form.weekend_rate3 = anyToFloat(this.form.weekday_rate1);
        this.form.weekend_rate4 = anyToFloat(this.form.weekday_rate1);
      }
    }
  }

  onChangeWeekendRate(isChildRate: boolean) {
    if (this.isFlat) {
      if (isChildRate) {
        this.form.weekend_rate_child2 = anyToFloat(
          this.form.weekend_rate_child1
        );
        this.form.weekend_rate_child3 = anyToFloat(
          this.form.weekend_rate_child1
        );
        this.form.weekend_rate_child4 = anyToFloat(
          this.form.weekend_rate_child1
        );
      } else {
        this.form.weekend_rate2 = anyToFloat(this.form.weekend_rate1);
        this.form.weekend_rate3 = anyToFloat(this.form.weekend_rate1);
        this.form.weekend_rate4 = anyToFloat(this.form.weekend_rate1);
      }
    }
  }

  onDoubleClickInputWeekend() {
    const value = copyValueDoubleClick(anyToFloat(this.form.weekday_rate1));
    if (value > 0) {
      this.form.weekend_rate1 = value;
      this.form.weekend_rate2 = value;
      this.form.weekend_rate3 = value;
      this.form.weekend_rate4 = value;
    }
  }

  getRowNodeId(params: any) {
    return params.id;
  }

  resetForm() {
    const date = new Date();
    this.form = {
      day1: 1,
      day2: 1,
      day3: 1,
      day4: 1,
      day5: 1,
      day6: 1,
      day7: 1,
      charge_frequency_code: "1",
      dynamic_rate_type_code: "N",
      id_sort: 0,
      is_active: 1,
      from_date: formatDateDatabase(date),
      to_date: formatDateDatabase(date.setFullYear(date.getFullYear() + 10)),
    };
  }

  getRows(): any[] {
    let data: any = [];
    this.gridApi.forEachNode((node) => {
      data.push(node.data);
    });
    return data;
  }

  onSubmit() {
    let rows = this.getRows();
    //Format value
    this.form.from_date = formatDateTimeZeroUTC(this.form.from_date);
    this.form.to_date = formatDateTimeZeroUTC(this.form.to_date);
    this.form.id_sort = anyToFloat(this.form.id_sort);

    this.form.weekday_rate1 = anyToFloat(this.form.weekday_rate1);
    this.form.weekday_rate2 = anyToFloat(this.form.weekday_rate2);
    this.form.weekday_rate3 = anyToFloat(this.form.weekday_rate3);
    this.form.weekday_rate4 = anyToFloat(this.form.weekday_rate4);

    this.form.weekend_rate1 = anyToFloat(this.form.weekend_rate1);
    this.form.weekend_rate2 = anyToFloat(this.form.weekend_rate2);
    this.form.weekend_rate3 = anyToFloat(this.form.weekend_rate3);
    this.form.weekend_rate4 = anyToFloat(this.form.weekend_rate4);

    this.form.weekday_rate_child1 = anyToFloat(this.form.weekday_rate_child1);
    this.form.weekday_rate_child2 = anyToFloat(this.form.weekday_rate_child2);
    this.form.weekday_rate_child3 = anyToFloat(this.form.weekday_rate_child3);
    this.form.weekday_rate_child4 = anyToFloat(this.form.weekday_rate_child4);

    this.form.weekend_rate_child1 = anyToFloat(this.form.weekend_rate_child1);
    this.form.weekend_rate_child2 = anyToFloat(this.form.weekend_rate_child2);
    this.form.weekend_rate_child3 = anyToFloat(this.form.weekend_rate_child3);
    this.form.weekend_rate_child4 = anyToFloat(this.form.weekend_rate_child4);

    if (this.modeData == 0 || this.modeData == 2) {
      const isExist = rows.find((val) => val.code == this.form.code);
      if (isExist) {
        getToastInfo(`Code ${this.form.code} is exist`);
        return;
      }
      this.insert();
    } else {
      this.update();
    }
  }

  async handleInsert() {
    this.tabIndex = 0;
    await this.getComboList();
    this.resetForm();
    this.modeData = 0;
    this.showForm = true;
  }

  handleSave() {
    this.formElement.$el.requestSubmit();
  }

  handleDelete(paramsData: any) {
    this.paramsData = paramsData;
    this.showConfirmation = true;
  }

  onDelete() {
    this.delete(this.paramsData.code);
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  async handleEdit(paramsData: any) {
    this.modeData = 1;
    this.tabIndex = 0;
    this.getComboList();
    await this.edit(paramsData.id);
  }

  async handleDuplicate(paramsData: any) {
    this.modeData = 2;
    this.tabIndex = 0;
    this.getComboList();
    await this.edit(paramsData.id);
    this.form.code = "";
  }

  // API =========================================================================================
  async getList() {
    try {
      const { data } = await wizardRoomRateAPI.getList();
      this.rowData = data ?? [];
      this.$emit("change", this.rowData);
    } catch (error) {
      getError(error);
    }
  }

  async edit(id: number) {
    try {
      const { data } = await wizardRoomRateAPI.edit(id);
      this.form = data;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async getComboList() {
    try {
      const { data } = await wizardRoomRateAPI.getComboList();
      this.options = data;
    } catch (error) {
      getError(error);
    }
  }

  async insert() {
    try {
      await wizardRoomRateAPI.insert(this.form);
      this.getList();
      await this.$nextTick(() => {
        this.modeData = 1;
      });
      this.tabIndex = 1;

      this.showForm = false;
    } catch (error) {
      getError(error);
    }
  }

  async update() {
    try {
      await wizardRoomRateAPI.update(this.form);
      this.getList();
      this.showForm = false;
    } catch (error) {
      getError(error);
    }
  }

  async delete(code: string) {
    try {
      await wizardRoomRateAPI.delete(code);
      this.getList();
    } catch (error) {
      getError(error);
    }
  }

  beforeMount() {
    this.gridOptions = {
      rowSelection: "single",
      actionGrid: {
        duplicate: true,
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
        field: "code",
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
      {
        headerName: this.$t("commons.table.code"),
        field: "code",
        cellRenderer: "agGroupCellRenderer",
        width: 120,
      },
      { headerName: this.$t("commons.table.name"), field: "name", width: 180 },
      {
        headerName: this.$t("commons.table.roomType"),
        field: "room_type_code",
        width: 140,
      },
      {
        headerName: this.$t("commons.table.startDate"),
        field: "from_date",
        width: 120,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.endDate"),
        field: "to_date",
        width: 120,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },

      {
        headerName: this.$t("commons.table.subCategory"),
        field: "SubCategoryName",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.company"),
        field: "CompanyName",
        width: 90,
      },
      {
        headerName: this.$t("commons.table.sales"),
        field: "market_code",
        width: 60,
      },
      {
        headerName: this.$t("commons.table.cmInv"),
        field: "cm_inv_code",
        width: 60,
      },
      {
        headerName: this.$t("commons.table.idSort"),
        field: "id_sort",
        width: 70,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
      },
      {
        headerName: this.$t("commons.table.active"),
        field: "is_active",
        width: 60,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.rateStructure"),
        field: "is_rate_structure",
        width: 90,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.online"),
        field: "is_online",
        width: 60,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.cmStopSell"),
        field: "cm_stop_sell",
        width: 90,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.lastDeal"),
        field: "is_last_deal",
        width: 80,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.compliment"),
        field: "is_compliment",
        width: 80,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.weekdayRate1"),
        field: "weekday_rate1",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.weekdayRate2"),
        field: "weekday_rate2",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.weekdayRate3"),
        field: "weekday_rate3",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.weekdayRate4"),
        field: "weekday_rate4",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.weekendRate1"),
        field: "weekend_rate1",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.weekendRate2"),
        field: "weekend_rate2",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.weekendRate3"),
        field: "weekend_rate3",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.weekendRate4"),
        field: "weekend_rate4",
        width: 130,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.taxAndService"),
        field: "TaxAndServiceName",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.chargeFrequency"),
        field: "ChargeFrequencyName",
        width: 130,
      },

      {
        headerName: this.$t("commons.table.extraPax"),
        field: "extra_pax",
        width: 90,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("commons.table.perPax"),
        field: "per_pax",
        width: 60,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.includeChild"),
        field: "include_child",
        width: 120,
        headerClass: "align-header-center",
        cellStyle: { textAlign: "center" },
        cellRenderer: "checklist",
      },
      { headerName: this.$t("commons.table.note"), field: "notes", width: 150 },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },

      // ------------------end need setting manual for column table-----------------//
    ];

    this.detailCellRenderer = "detailCellRenderer";
    this.frameworkComponents = {
      checklist: checklistVue,
      // detailCellRenderer: DetailCellRender,
      actionGrid: action_gridVue,
    };
    this.getList();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  get schema() {
    return Yup.object().shape({
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-' symbol"
        )
        .required()
        .max(10),
      Name: Yup.string().required().max(100),
      "Room Type": Yup.string().required(),
      // "Charge Frequency": Yup.string().required(),
      // "ID Sort": Yup.number(),
      // "Start Date": Yup.date()
      //   .required()
      //   .test((val) => val < new Date(this.form.to_date)),
      // "End Date": Yup.date().required(),
    });
  }

  get title() {
    return (this.modeData == 1 ? "Update " : "Insert ") + " Room Rate";
  }

  get useRateChild() {
    return this.config.useRateChild;
  }
}
