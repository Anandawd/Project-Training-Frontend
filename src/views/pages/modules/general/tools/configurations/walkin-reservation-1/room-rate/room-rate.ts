import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import {
  generateIconContextMenuAgGrid,
  getError,
  rowSelectedAfterRefresh,
} from "@/utils/general";
import Select from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import $global from "@/utils/global";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import MultiForm from "./components/multi-form/multi-form.vue";
import Breakdown from "./components/breakdown/breakdown.vue";
import BusinessSource from "./components/business-source/business-source.vue";
import Currency from "./components/currency/currency.vue";
import BaseOccupancy from "./components/base-occupancy/base-occupancy.vue";
import BaseSession from "./components/base-session/base-session.vue";
import { reactive, ref } from "vue";
import { getToastInfo, getToastSuccess } from "@/utils/toast";
import CDialog from "@/components/dialog/dialog.vue";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
} from "@/utils/format";
import * as Yup from "yup";
import DetailCellRender from "./components/detail-cell-renderer/detail-cell-renderer.vue";
import Checklist from "@/components/ag_grid-framework/checklist.vue";
import { generateIconMenuAgGrid } from "@/utils/general";
import trackingDataModule from "@/stores/tracking-data";
import ChannelManager from "@/services/api/channel-manager/channel-manager";
const resourceAPI = new ConfigurationResource("RoomRate");
const channelManagerApi = new ChannelManager();

@Options({
  components: {
    Breakdown,
    BusinessSource,
    Currency,
    CDialog,
    MultiForm,
    Select,
    CRadio,
    CDatepicker,
    CInput,
    AgGridVue,
    SearchFilter,
    BaseOccupancy,
    BaseSession,
  },
})
export default class RoomRate extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public multiFormElement: any = ref();
  public breakdownFormElement: any = ref();
  public businessSourceFormElement: any = ref();
  public currencyFormElement: any = ref();
  public baseOccupancyElement: any = ref();
  public baseSessionElement: any = ref();
  public showForm: boolean = false;
  public hideGroupByCode: any = [];
  public focus: boolean = false;
  hideDropdownGroup: boolean = false;
  hideButton: boolean = false;
  isDisabled: boolean = false;
  showUpdateRate: boolean = false;
  public showDialog: boolean = false;
  public isSaving: boolean = false;
  public options: any = {};
  public showFormType: number = 0;
  public modeData: any = 0;
  public roomRateCodeSelected: any;
  fullSync: any = reactive({});
  deleteCode: any = "";
  searchDefault: {
    index: number;
    text: string;
    filter: any[];
  } = null;
  searchOptions: any = [];
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
  gridOptions: any = {};
  detailCellRenderer: any;
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
  // GENERAL FUNCTION ================================================================
  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

  // handleRowDoubleClicked(params: any) {
  //   this.handleEdit(params.data)
  // }

  // ------------------------additional for context menu ag-Grid-----------//

  getContextMenu(params: any) {
    const { node } = params;
    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result = [
      {
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", $global.modeData.insert),
      },
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
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        action: () => this.handleDuplicate(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.updateAllGuestInHouseRate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleUpdateGuestInHouseRate(),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () =>
          this.handleTrackingData(
            $global.tableName.cfgInitRoomRate,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
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

  handleMenu(params: any) {
    this.paramsData = params.data;
  }

  rowSelected(event: any) {
    let dataSelected = this.gridOptions.api.getSelectedRows();
    dataSelected[0].is_online === 0
      ? (this.isDisabled = true)
      : (this.isDisabled = false);
  }

  rowDoubleClicked(event: any) {
    this.handleEdit(event.data);
  }

  refreshData(search: any) {
    this.loadData(search);
  }

  refreshAfterSave() {
    this.loadData();
    this.hideButton = false;
  }

  refreshAfterUpdate() {
    this.loadData();
  }

  onClose() {
    this.showForm = false;
    this.hideButton = false;
  }

  handleUpdateGuestInHouseRate() {
    this.showUpdateRate = true;
  }

  handleShowForm(params: any, mode: any) {
    this.multiFormElement.initialize();
    this.loadDropdown();
    this.modeData = mode;
    // set focus
    this.focus = true;
    // this.breakdownFormElement.focus = false
    // this.businessSourceFormElement.focus = false
    // this.currencyFormElement.focus = false

    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.showForm = true;
    this.hideButton = true;
  }

  handleInsertDetail1(paramsData: any) {
    this.hideButton = true;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.breakdownFormElement.code = paramsData.code;
    this.breakdownFormElement.handleShowForm("", $global.modeData.insert);
    // set focus
    this.focus = false;
    this.breakdownFormElement.focus = true;
    this.businessSourceFormElement.focus = false;
    this.currencyFormElement.focus = false;
    this.baseSessionElement.focus = false;
    this.baseOccupancyElement.focus = false;

    this.showForm = false;
  }

  handleInsertDetail2(paramsData: any) {
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.businessSourceFormElement.code = paramsData.code;
    this.businessSourceFormElement.handleShowForm("", $global.modeData.insert);
    // set focus
    this.focus = false;
    this.breakdownFormElement.focus = false;
    this.businessSourceFormElement.focus = true;
    this.currencyFormElement.focus = false;
    this.baseSessionElement.focus = false;
    this.baseOccupancyElement.focus = false;

    this.showForm = false;
  }

  handleInsertDetail3(paramsData: any) {
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.currencyFormElement.code = paramsData.code;
    this.currencyFormElement.handleShowForm("", $global.modeData.insert);
    // set focus
    this.focus = false;
    this.breakdownFormElement.focus = false;
    this.businessSourceFormElement.focus = false;
    this.currencyFormElement.focus = true;
    this.baseSessionElement.focus = false;
    this.baseOccupancyElement.focus = false;

    this.showForm = false;
  }

  clickButtonGroup(event: any) {
    if (
      event.dynamic_rate_type_code.includes("S") ||
      event.dynamic_rate_type_code.includes("O")
    ) {
      let rateTypeCode = event.dynamic_rate_type_code.split("|");
      this.hideGroupByCode = rateTypeCode;
      this.hideDropdownGroup = false;
    } else {
      this.hideDropdownGroup = true;
      this.hideGroupByCode = [];
    }
  }

  async handleInsertDetailGroup(param: any, data: any) {
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    // set focus
    this.focus = false;
    this.breakdownFormElement.focus = false;
    this.businessSourceFormElement.focus = false;
    this.currencyFormElement.focus = false;
    if (param == "S") {
      this.baseOccupancyElement.showForm = false;
      // set focus
      this.baseSessionElement.focus = true;
      this.baseOccupancyElement.focus = false;
      this.baseSessionElement.handleShowForm(
        param,
        data,
        $global.modeData.insert
      );
    } else {
      this.baseSessionElement.showForm = false;
      // set focus
      this.baseOccupancyElement.focus = true;
      this.baseSessionElement.focus = false;
      this.baseOccupancyElement.handleShowForm(
        param,
        data,
        $global.modeData.insert
      );
    }
  }

  handleDelete(params: any) {
    this.showDialog = true;
    this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.modeData = $global.modeData.edit;
    this.loadDropdown();
    await this.editData(params.code);
  }
  async handleEditBreakdown(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.edit;
    this.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.breakdownFormElement.handleEdit(params);
  }
  async handleEditBusinessSource(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.edit;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.businessSourceFormElement.handleEdit(params);
  }
  async handleEditCurrency(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.edit;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.currencyFormElement.handleEdit(params);
  }
  handleEditBaseOccupancy(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.edit;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseOccupancyElement.handleEdit(params);
  }
  handleEditBaseSession(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.edit;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.baseSessionElement.handleEdit(params);
  }

  async handleDuplicate(params: any) {
    this.hideButton = true;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.loadDropdown();
    this.modeData = $global.modeData.duplicate;
    await this.editData(params.code);
  }
  async handleDuplicateBreakdown(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.duplicate;
    this.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.breakdownFormElement.handleDuplicate(params);
  }
  async handleDuplicateBusinessSource(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.duplicate;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.businessSourceFormElement.handleDuplicate(params);
  }
  async handleDuplicateCurrency(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.duplicate;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.currencyFormElement.handleDuplicate(params);
  }
  async handleDuplicateBaseOccupancy(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.duplicate;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseSessionElement.showForm = false;
    this.baseOccupancyElement.handleDuplicate(params);
  }
  async handleDuplicateBaseSession(params: any) {
    this.hideButton = true;
    this.modeData = $global.modeData.duplicate;
    this.showForm = false;
    this.breakdownFormElement.showForm = false;
    this.businessSourceFormElement.showForm = false;
    this.currencyFormElement.showForm = false;
    this.baseOccupancyElement.showForm = false;
    this.baseSessionElement.handleDuplicate(params);
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    formData.from_date = formatDateTimeUTC(formData.from_date);
    formData.to_date = formatDateTimeUTC(formData.to_date);
    formData.cm_end_date = formData.to_date;
    formData.cm_start_date = formData.from_date;
    formData.is_last_deal = parseInt(formData.is_last_deal);
    formData.is_rate_structure = parseInt(formData.is_rate_structure);
    formData.is_compliment = parseInt(formData.is_compliment);
    formData.include_breakfast = parseInt(formData.include_breakfast);
    formData.weekday_rate1 = parseFloat(formData.weekday_rate1);
    formData.weekday_rate2 = parseFloat(formData.weekday_rate2);
    formData.weekday_rate3 = parseFloat(formData.weekday_rate3);
    formData.weekday_rate4 = parseFloat(formData.weekday_rate4);
    formData.weekend_rate1 = parseFloat(formData.weekend_rate1);
    formData.weekend_rate2 = parseFloat(formData.weekend_rate2);
    formData.weekend_rate3 = parseFloat(formData.weekend_rate3);
    formData.weekend_rate4 = parseFloat(formData.weekend_rate4);
    formData.weekday_rate_child1 = parseFloat(formData.weekday_rate_child1);
    formData.weekday_rate_child2 = parseFloat(formData.weekday_rate_child2);
    formData.weekday_rate_child3 = parseFloat(formData.weekday_rate_child3);
    formData.weekday_rate_child4 = parseFloat(formData.weekday_rate_child4);
    formData.weekend_rate_child1 = parseFloat(formData.weekend_rate_child1);
    formData.weekend_rate_child2 = parseFloat(formData.weekend_rate_child2);
    formData.weekend_rate_child3 = parseFloat(formData.weekend_rate_child3);
    formData.weekend_rate_child4 = parseFloat(formData.weekend_rate_child4);
    formData.cm_stop_sell = parseInt(formData.cm_stop_sell);
    formData.per_pax_extra = parseFloat(formData.per_pax_extra);
    formData.extra_pax = parseFloat(formData.extra_pax);
    formData.per_pax = parseInt(formData.per_pax);
    formData.include_child = parseInt(formData.include_child);
    formData.day1 = parseInt(formData.day1);
    formData.day2 = parseInt(formData.day2);
    formData.day3 = parseInt(formData.day3);
    formData.day4 = parseInt(formData.day4);
    formData.day5 = parseInt(formData.day5);
    formData.day6 = parseInt(formData.day6);
    formData.day7 = parseInt(formData.day7);
    formData.id_sort = parseInt(formData.id_sort);
    formData.is_active = parseInt(formData.is_active);
    formData.is_online = parseInt(formData.is_online);
    formData.cm_stop_sell = parseInt(formData.cm_stop_sell);
    if (this.modeData == $global.modeData.insert) {
      await this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      await this.updateData(formData);
    } else if (this.modeData == $global.modeData.duplicate) {
      await this.insertData(formData);
    }
    this.isSaving = false;
    this.hideButton = false;
  }

  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataModule();
    trackingData.show(tableName, id);
  }

  async postChannelManager() {
    let dataSelected = this.gridOptions.api.getSelectedRows();
    let formData = dataSelected[0];
    if (formData.is_online == 0) {
      getToastInfo(this.$t("messages.isOnlineChecklist"));
      return;
    }

    if (!formData.cm_inv_code) {
      getToastInfo(this.$t("messages.invCodeCantEmpty"));
    } else {
      const params = {
        sync_all: this.fullSync,
        rate_code: formData.code,
      };
      await this.insertRatePlanToChannex(params);
    }
  }

  clickFullSync() {
    this.fullSync = !this.fullSync;
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadData(search: any = this.searchDefault) {
    const selectedRow = this.gridApi.getSelectedRows();
    this.gridApi.showLoadingOverlay();
    let rowNodes: any = [];
    this.gridApi.forEachNode((nodeX: any) => {
      rowNodes.push(nodeX);
    });
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        Option1: search.filter[0],
      };
      const { data } = await resourceAPI.list(params);
      this.rowData = data;
      rowSelectedAfterRefresh(this, null, selectedRow[0], "code", rowNodes);
    } catch (error) {
      getError(error);
    }
    this.gridApi.hideOverlay();
  }

  async loadDetailData(code: string) {
    let result = [];
    try {
      const { data } = await resourceAPI.detailDataList("RoomRate", code);
      result = data;
    } catch (error) {}
    return result;
  }

  async loadDropdown() {
    try {
      const params = [
        "RoomType",
        "RoomRateSubCategory",
        "Company",
        "Market",
        "DynamicRateType",
        "TaxAndService",
        "ChargeFrequency",
      ];
      const { data } = await resourceAPI.codeNameListArray(params);
      this.multiFormElement.listDropdown = data;
    } catch (error) {
      getError(error);
    }
  }

  async editData(code: any) {
    try {
      let { data } = await resourceAPI.edit(code);
      if (data) {
        this.multiFormElement.isUsed = data.is_used;
        data = data.data;
      } else {
        return;
      }
      this.multiFormElement.onEdit(data);
      this.form.code = data.code;
      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }

  async updateData(formData: any) {
    try {
      formData.code = this.form.code;
      const { status2 } = await resourceAPI.update(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertData(formData: any) {
    try {
      const { status2 } = await resourceAPI.create(formData);
      if (status2.status == 0) {
        this.loadData();
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertRatePlanToChannex(params: any) {
    try {
      const { status2 } = await channelManagerApi.postRatePlan(params);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async deleteData() {
    try {
      const { status2 } = await resourceAPI.delete(this.deleteCode);
      if (status2.status == 0) {
        this.loadData();
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async updateDataAllGuestInHouseRate() {
    try {
      let selectedRow = this.gridApi.getSelectedRows();
      for (const i of selectedRow) {
        const room_rate_code = i.code;
        const { status2 } = await resourceAPI.updateAllGuestInHouseRate(
          room_rate_code
        );
        if (status2.status == 0) {
          this.loadData();
          this.showUpdateRate = false;
          getToastSuccess(this.$t("messages.processCompleted"));
        }
      }
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.searchDefault = {
      index: 1,
      text: "",
      filter: ["1"],
    };
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.name"), value: 1 },
      { text: this.$t("commons.filter.roomType"), value: 2 },
      { text: this.$t("commons.filter.subCategory"), value: 3 },
      { text: this.$t("commons.filter.company"), value: 4 },
      { text: this.$t("commons.filter.sales"), value: 5 },
      { text: this.$t("commons.filter.cmInv"), value: 6 },
      { text: this.$t("commons.filter.taxAndService"), value: 7 },
      { text: this.$t("commons.filter.chargeFrequency"), value: 8 },
      { text: this.$t("commons.filter.notes"), value: 9 },
      { text: this.$t("commons.filter.createdBy"), value: 10 },
      { text: this.$t("commons.filter.updatedBy"), value: 10 },
    ];
    this.agGridSetting = $global.agGrid;

    this.gridOptions = {
      actionGrid: {
        menu: true,
        delete: true,
        edit: true,
        duplicate: true,
        insertDetail1: {
          title: "Insert Breakdown",
        },
        insertDetail2: {
          title: "Insert Business Source & AP List",
        },
        insertDetail3: {
          title: "Insert Currency",
        },
        insertDetailGroup: {
          title: "Insert Group",
          titleDropdown: [
            {
              title: "Insert Base Occupancy",
              code: "O",
            },
            {
              title: "Insert Base Session",
              code: "S",
            },
          ],
        },
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
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
        width: 220,
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
        headerName: this.$t("commons.table.createdAt"),
        field: "created_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.updatedAt"),
        field: "updated_at",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 100,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklist: Checklist,
      iconLockRenderer: IconLockRenderer,
      detailCellRenderer: DetailCellRender,
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

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.fullSync = false;
    this.loadData(this.searchDefault);
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    let value: boolean = true;
    if (
      this.showForm == false &&
      this.breakdownFormElement.showForm == false &&
      this.businessSourceFormElement.showForm == false &&
      this.currencyFormElement.showForm == false &&
      this.baseOccupancyElement.showForm == false &&
      this.baseSessionElement.showForm == false
    ) {
      value = false;
    }
    return value;
  }
  get hideButtonGroupByCode() {
    return this.hideGroupByCode;
  }
  get hideDropdown() {
    return this.hideDropdownGroup;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      Name: Yup.string().required().max(255),
      Code: Yup.string()
        .matches(
          /^[a-zA-Z0-9-_\.]+$/,
          "Code must only contain alphanumeric characters or the '-', '_', '.' symbols"
        )
        .required()
        .max(10),
      "Room Type": Yup.string().required(),
      "Start Date": Yup.string().required(),
      "End Date": Yup.string().required(),
      "Dynamic Rate": Yup.string().required(),
      "Charge Frequency": Yup.string().required(),
      "ID Sort": Yup.number(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
