import { Options, Vue } from "vue-class-component";
import { ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import reportAPI from "../../../services/api/report/report-module";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatDateTimeZeroUTC,
  formatNumber,
} from "@/utils/format";
import ActionGrid from "../../../components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "../../../components/ag_grid-framework/lock_icon.vue";
import Checklist from "../../../components/ag_grid-framework/checklist.vue";
import $global from "@/utils/global";
import { getToastSuccess, getToastInfo, getToastError } from "@/utils/toast";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";
import InputForm from "./report-input-form/report-input-form.vue";
import CDialog from "../../../components/dialog/dialog.vue";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "../../../components/radio/radio.vue";
import "ag-grid-enterprise";
import ReportForm from "./report-input-form/report-form.vue";
import Vue3TreeVue from "vue3-tree-vue";
import "vue3-tree-vue/dist/style.css";
import { array } from "yup";
const ReportAPI = new reportAPI();

@Options({
  components: {
    AgGridVue,
    ReportForm,
    CDialog,
    SearchFilter,
    CSelect,
    CRadio,
    CInput,
    Checkbox,
    CDatepicker,
    Vue3TreeVue,
  },
})
export default class purchaseRequest extends Vue {
  public items: any = [];
  public itemsAll: any = [];
  public itemsRaw: any = [];
  public expandedIds: any = [];
  public selectedItem: any = [];
  public filtered: boolean = true;
  public is_expand: boolean = false;
  public rowData: any = [];
  public showForm: boolean = false;
  public showFormHistory: boolean = false;
  public modeData: any;
  public form: any = {};
  public dateRange: any = {};
  public inputFormElement: any = ref();
  public inputFormElementHistory: any = ref();
  public showDialog: boolean = false;
  public deleteParam: any;
  public searchOptions: any;
  public formType: any;
  searchDefault: any = {
    index: 0,
    text: "",
    filter: [0],
  };
  public listDropdown: any = {
    weekList: [],
    yearList: [],
    monthList: [],
    quarterList: [
      { code: "I", name: "I" },
      { code: "II", name: "II" },
      { code: "III", name: "III" },
      { code: "IV", name: "IV" },
    ],
    semesterList: [
      { code: "I", name: "I" },
      { code: "II", name: "II" },
    ],
  };
  // Extra Variable for Insert Reconciliation
  public cellSelectedStatusActive: any;
  public cellSelectedStatusBlacklist: any;
  public cellSelected: any;
  public isCellSelected: boolean = false;
  public faCode: any;
  public searchReport: any;
  public reportCode: any = "";
  public reportId: any;
  // Ag grid variable
  detailRowAutoHeight: boolean = true;
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
  // GENERAL FUNCTION ================================================================
  handleSave(formData: any) {
    if (
      this.modeData == $global.modeData.insert ||
      this.modeData == $global.modeData.duplicate
    ) {
      this.insertData(formData);
    } else if (this.modeData == $global.modeData.edit) {
      this.updateData(formData);
    }
  }
  async handleEdit(params: any) {
    this.modeData = $global.modeData.edit;
    if (params.is_system == 1) {
      getToastError(this.$t("messages.cantEditSystem"));
    } else {
      await this.GetReport(params.report_code, params.id);
    }
  }
  async handleDuplicate(params: any) {
    this.modeData = $global.modeData.duplicate;
    await this.GetReport(params.report_code, params.id);
  }
  handleDelete(params: any) {
    if (params.is_system == 1) {
      getToastError(this.$t("messages.cantEditSystem"));
    } else {
      this.showDialog = true;
      this.deleteParam = params.id;
    }
  }
  refreshData(search: any) {
    this.loadDataGrid(search);
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
        name: this.$t("commons.contextMenu.insert"),
        icon: generateIconContextMenuAgGrid("add_icon24"),
        action: () => this.handleShowForm("", 0),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        action: () => this.handleShowForm(this.paramsData, 1),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () => this.handleShowForm(this.paramsData, 2),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.setDefault"),
        disabled: !this.paramsData,
        action: () =>
          this.updateDefaultReport(this.paramsData.id, this.reportCode),
      },
    ];
    return result;
  }
  handleRowRightClicked() {
    if (this.paramsData) {
      const vm = this;
      vm.gridApi.forEachNode((node: any) => {
        if (node.data) {
          if (node.data.id_log == vm.paramsData.id_log) {
            node.setSelected(true, true);
          }
        }
      });
    }
  }
  async handleSearchReport() {
    this.filtered = false;
    var searchStr = this.searchReport;
    if (searchStr == "") {
      this.items = this.itemsAll;
      this.expandedIds = [];
      await this.$nextTick();
      this.filtered = true;
    } else {
      const regexp = new RegExp(searchStr, "i");
      var res = this.itemsRaw.filter((x: any) => {
        return regexp.test(x.name);
      });
      if (res.length != 0) {
        this.items = this.reportListArrange(res, "search");
        this.expandedIds = this.items.map((i: any) => i.id);
        await this.$nextTick();
        this.filtered = true;
      } else {
        this.items = this.itemsAll;
        this.expandedIds = [];
        await this.$nextTick();
        this.filtered = true;
      }
    }
  }
  handleResetDateRange() {
    let date = formatDateTimeZeroUTC(new Date());
    let date1 = date.split("T");
    var splitedDate = date1[0].split("-");
    let month = parseInt(splitedDate[1]);
    let year = parseInt(splitedDate[0]);
    var quarter = "I";
    var semester = "I";
    // Year List
    for (let index = year - 10; index <= year; index++) {
      this.listDropdown.yearList.push({ code: index, name: index });
    }
    for (let index = year + 1; index <= year + 10; index++) {
      this.listDropdown.yearList.push({ code: index, name: index });
    }
    // Week List
    for (let index = 1; index <= 53; index++) {
      this.listDropdown.weekList.push({ code: index, name: index });
    }
    // Month List
    for (let index = 1; index <= 12; index++) {
      this.listDropdown.monthList.push({ code: index, name: index });
    }
    if (parseInt(splitedDate[1]) >= 10) {
      quarter = "IV";
    } else if (parseInt(splitedDate[1]) >= 7) {
      quarter = "III";
    } else if (parseInt(splitedDate[1]) >= 4) {
      quarter = "II";
    }
    if (parseInt(splitedDate[1]) >= 7) {
      semester = "II";
    }
    function getWeekNumber(d: any) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      var yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      var weekNo: any = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return [d.getUTCFullYear(), weekNo];
    }
    var weekNumber = getWeekNumber(new Date());

    this.dateRange = {
      type: 0,
      dateFrom: formatDateTimeZeroUTC(new Date()),
      dateTo: formatDateTimeZeroUTC(new Date()),
      date: formatDateTimeZeroUTC(new Date()),
      yearOfWeek: year,
      yearOfMonth: year,
      yearOfQuarter: year,
      yearOfSemester: year,
      year: year,
      month: month,
      quarter: quarter,
      semester: semester,
      week: weekNumber[1],
    };
  }
  handleChangeType(type: any) {
    if (type == 0) {
      this.dateRange.type = 0;
    }
    if (type == 1) {
      this.dateRange.type = 1;
    }
    if (type == 2) {
      this.dateRange.type = 2;
    }
    if (type == 3) {
      this.dateRange.type = 3;
    }
    if (type == 4) {
      this.dateRange.type = 4;
    }
    if (type == 5) {
      this.dateRange.type = 5;
    }
    if (type == 6) {
      this.dateRange.type = 6;
    }
  }

  onItemSelected(params: any) {
    // params.item.code
    this.reportCode = params.item.code;
    this.GetReportTemplateList(params.item.code);
  }

  reportListArrange(data: any, mode: any) {
    // console.log("arr");
    let arr: any = [];
    if (mode == "load") {
      data.forEach((element: any) => {
        if (element.parent_id == 0) {
          // console.log("name", element.name);
          arr.push({
            name: element.name,
            id: element.id,
            code: element.code,
            type: "folder",
            children: [],
          });
        }
      });
      for (const key in arr) {
        data.forEach((element1: any) => {
          if (element1.parent_id == arr[key].code) {
            arr[key].children.push({
              name: element1.name,
              id: element1.id,
              code: element1.code,
              type: "report",
            });
          }
        });
      }
    } else if (mode == "search") {
      data.forEach((element: any) => {
        if (element.parent_id == 0) {
          arr.push({
            name: element.name,
            id: element.id,
            code: element.code,
            type: "folder",
            children: [],
          });
        }
      });
      data.forEach((element1: any) => {
        if (element1.parent_id != 0) {
          let check = arr.find((o: any) => o.code == element1.parent_id);
          if (check != undefined) {
            let target = arr.findIndex(
              (obj: any) => obj.code == element1.parent_id
            );
            arr[target].children.push({
              name: element1.name,
              id: element1.id,
              code: element1.code,
              type: "report",
            });
          } else {
            let Add = this.itemsRaw.find(
              (o: any) => o.code == element1.parent_id
            );
            arr.push({
              name: Add.name,
              id: Add.id,
              code: Add.code,
              type: "folder",
              children: [],
            });
            let targetAfterPush = arr.findIndex(
              (obj: any) => obj.code == Add.code
            );
            arr[targetAfterPush].children.push({
              name: element1.name,
              id: element1.id,
              code: element1.code,
              type: "report",
            });
          }
        }
      });
      for (const key in arr) {
        if (arr[key].children.length == 0) {
          this.itemsRaw.forEach((el: any) => {
            if (el.parent_id == arr[key].code) {
              arr[key].children.push({
                name: el.name,
                id: el.id,
                code: el.code,
                type: "report",
              });
            }
          });
        }
      }
    }
    return arr;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async handleShowForm(params: any, mode: any) {
    await this.inputFormElement.initialize();
    if (this.reportCode) {
      this.GetReport(this.reportCode, "");
    }
    this.modeData = mode;
    this.showForm = true;
  }
  async handleShowFormHistory() {
    this.showFormHistory = true;
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataGrid(search: any = this.searchDefault) {
    try {
      let params = {
        Index: search.index,
        Text: search.text,
        StatusIndex: parseInt(search.filter[0]),
      };
      const { data } = await ReportAPI.GetLinenManagementList(params);
      this.rowData = data;
    } catch (error) {}
  }
  async insertData(formData: any) {
    try {
      const { status2 } = await ReportAPI.InsertReport(formData);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.showForm = false;
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      getError(error);
    }
  }
  async GetReport(reportCode: any, templateId: any) {
    try {
      let parameters: any = {
        ReportCode: reportCode,
        TemplateId: templateId,
      };
      const { data } = await ReportAPI.GetReport(parameters);
      if (
        this.modeData == $global.modeData.edit ||
        this.modeData == $global.modeData.duplicate
      ) {
        this.inputFormElement.onEdit(data);
      } else {
        this.inputFormElement.onInsert(data);
      }
      this.reportId = data.ReportTemplate.id;
      console.log("id", this.reportId);

      this.showForm = true;
    } catch (error) {
      getError(error);
    }
  }
  async updateData(formData: any) {
    formData.id = this.reportId;
    console.log(formData);
    try {
      const { status2 } = await ReportAPI.UpdateReport(formData);
      if (status2.status == 0) {
        this.showForm = false;
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      getError(error);
    }
  }
  async updateDefaultReport(templateId: any, reportCode: any) {
    try {
      let params: any = {
        ReportCode: reportCode,
        TemplateId: templateId,
      };
      const { status2 } = await ReportAPI.UpdateDefaultReport(params);
      if (status2.status == 0) {
        getToastSuccess(this.$t("messages.saveSuccess"));
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      getError(error);
    }
  }
  async GetReportList() {
    try {
      const { data } = await ReportAPI.GetReportList();
      let arr: any = this.reportListArrange(data, "load");
      this.items = arr;
      this.itemsAll = arr;
      this.itemsRaw = data;

      this.expandedIds = ["1"];
    } catch (error) {
      getError(error);
    }
  }
  async deleteData() {
    try {
      const { status2 } = await ReportAPI.DeleteReport(this.deleteParam);
      if (status2.status == 0) {
        this.loadDataGrid("");
        this.showDialog = false;
        getToastSuccess(this.$t("messages.deleteSuccess"));
        this.GetReportTemplateList(this.reportCode);
      }
    } catch (error) {
      getError(error);
    }
  }
  async GetReportTemplateList(params: any) {
    try {
      const { data } = await ReportAPI.GetReportTemplateList(params);
      this.rowData = data;
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  mounted() {
    // this.loadDataGrid(this.searchDefault)
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
    this.GetReportList();
    this.handleResetDateRange();
  }

  beforeMount() {
    this.searchOptions = [
      { text: this.$t("commons.filter.code"), value: 0 },
      { text: this.$t("commons.filter.barcode"), value: 1 },
      { text: this.$t("commons.filter.item"), value: 2 },
      { text: this.$t("commons.filter.detailName"), value: 3 },
      { text: this.$t("commons.filter.location"), value: 4 },
      { text: this.$t("commons.filter.receiveNumber"), value: 5 },
      { text: this.$t("commons.filter.depreciationType"), value: 6 },
      { text: this.$t("commons.filter.receiveId"), value: 7 },
      { text: this.$t("commons.filter.sortNumber"), value: 8 },
      { text: this.$t("commons.filter.serialNumber"), value: 9 },
      { text: this.$t("commons.filter.manufacture"), value: 10 },
      { text: this.$t("commons.filter.trademark"), value: 11 },
      { text: this.$t("commons.filter.refNumber"), value: 12 },
      { text: this.$t("commons.filter.remark"), value: 13 },
      { text: this.$t("commons.filter.createdBy"), value: 14 },
    ];
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      actionGrid: {
        edit: true,
        delete: true,
        duplicate: true,
      },
      onCellClicked: (params: any) => {
        let par = {
          index: 0,
          text: "",
          fa_code: params.data.code,
        };
        this.inputFormElementHistory.searchDefault.fa_code = params.data.code;
        this.inputFormElementHistory.loadDataGrid(par);
        this.isCellSelected = true;
      },
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        field: "id",
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
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "name",
        width: 140,
        cellStyle: function (params: any) {
          console.log(params);
          if (params.data.is_default == 1) {
            if (params.data.is_system == 1) {
              return { color: "red", fontWeight: "bold" };
            } else {
              return { fontWeight: "bold" };
            }
          } else if (params.data.is_system == 1) {
            if (params.data.is_default == 1) {
              return { color: "red", fontWeight: "bold" };
            } else {
              return { color: "red" };
            }
          }
        },
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "report_code",
        width: 140,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "is_default",
        width: 140,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.name"),
        field: "is_system",
        width: 140,
        hide: true,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.detailCellRenderer = "detailCellRenderer";
    this.detailRowAutoHeight = true;
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      checklistRenderer: Checklist,
    };
    this.rowGroupPanelShow = "never";
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
    this.rowSelection = "multiple";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get disabledActionGrid() {
    return this.showForm;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
