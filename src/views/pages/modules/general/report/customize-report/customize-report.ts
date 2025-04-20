import { Options, Vue } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import reportAPI from "@/services/api/report/report-module";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import * as Yup from "yup";
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import { getToastSuccess, getToastInfo, getToastError } from "@/utils/toast";
import { BTabs, BTab } from "bootstrap-vue-3";
import {
  generateTotalFooterAgGrid,
  generateIconContextMenuAgGrid,
  getError,
} from "@/utils/general";
import {
  formatDate,
  formatDateTime,
  formatDateTimeUTC,
  formatDateTimeZeroUTC,
  formatNumber,
} from "@/utils/format";
import { AgGridVue } from "ag-grid-vue3";
import configStore from "@/stores/config";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import checklistRenderer from "../component/checklist-renderer.vue";
import DailyReport from "./daily-report/daily-report.vue";
import MonthlyReport from "./monthly-report/monthly-report.vue";
import YearlyReport from "./yearly-report/yearly-report.vue";
import FavoriteReport from "./favorite-report/favorite-report.vue";
import FootertypeDropdownRenderer from "../component/footertype-dropdown-renderer.vue";
import FormatDropdownRenderer from "../component/format-dropdown-renderer.vue";
import FontDropdownRenderer from "../component/font-dropdown-renderer.vue";
import AlignmentDropdownRenderer from "../component/alignment-dropdown-renderer.vue";
import ColorDropdownRenderer from "../component/color-dropdown-renderer.vue";

const ReportAPI = new reportAPI();

@Options({
  name: "CustomizeReport",
  components: {
    BTabs,
    BTab,
    Form,
    CRadio,
    CSelect,
    CInput,
    Checkbox,
    CDatepicker,
    AgGridVue,
    DailyReport,
    MonthlyReport,
    YearlyReport,
    FavoriteReport,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    reportCode: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class CustomizeReport extends Vue {
  inputFormValidation: any = ref();
  inputFormValidationGrid: any = ref();
  dailyElement: any = ref();
  monthlyElement: any = ref();
  yearlyElement: any = ref();
  favoriteElement: any = ref();
  modeData: any;
  public paperSize: any = [
    { code: 0, name: "(Custom)" },
    { code: 1, name: "A4" },
    { code: 2, name: "Letter" },
    { code: 3, name: "Legal" },
    { code: 4, name: "Folio" },
  ];

  public reportCode: number;
  public config = configStore();
  public defaultForm: any = {};
  public form: any = reactive({});
  public isOther: boolean = true;
  public rowData: any = [];
  public isSave: boolean = false;
  public idGrid: any = 0;
  public idGridEdit: any = 0;
  public account_code: any;
  public totalAmount: any = 0;
  public dataMode: any;
  public dataEdited: any;
  public formData: any = reactive({});
  public qtyConvertion: any;
  public totalFooter: any = [];
  public id: number = 0;
  public sendData: any = {};
  public isSaving: boolean = false;
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];
  public paperSizeDefault: any = [
    { width: this.form.width, height: this.form.height },
    { width: 21.0, height: 29.7 },
    { width: 21.6, height: 27.9 },
    { width: 21.6, height: 35.6 },
    { width: 21.6, height: 33.02 },
  ];
  // Dropdown Options
  listDropdown: any = {
    Location: [],
  };
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
  // GENERAL FUNCTION ================================================================
  async resetForm() {
    this.inputFormValidation.resetForm();
    await this.$nextTick();
  }
  async resetForm2() {
    this.inputFormValidationGrid.resetForm();
    this.formData = {};
    this.qtyConvertion = 0;
  }

  initialize() {
    this.GetReportList()
    this.dailyElement.rowData = [];
    this.monthlyElement.rowData = [];
    this.yearlyElement.rowData = [];
    this.favoriteElement.rowData = [];
  }

  getDataForm() {
    this.sendData.report_code = this.reportCode;
    this.sendData.name = this.form.template_name;
    // this.sendData.group_level = this.reportGroupingElement.getRowData().length;
    this.sendData.header_remark = this.form.header_remark;
    this.sendData.show_footer = this.form.show_footer;
    this.sendData.show_page_number = this.form.show_page_number;
    this.sendData.paper_size = this.form.paper_size;
    this.sendData.paper_width = parseFloat(this.form.width);
    this.sendData.paper_height = parseFloat(this.form.height);
    this.sendData.is_portrait = parseInt(this.form.is_portrait);
    this.sendData.header_row_height = this.form.header_height;
    this.sendData.row_height = this.form.data_height;
    this.sendData.horizontal_border = this.form.horizontal_border;
    this.sendData.vertical_border = this.form.vertical_border;
    this.sendData.sign_name1 = this.form.sign_name1;
    this.sendData.sign_position1 = this.form.sign_position1;
    this.sendData.sign_name2 = this.form.sign_name2;
    this.sendData.sign_position2 = this.form.sign_position2;
    this.sendData.sign_name3 = this.form.sign_name3;
    this.sendData.sign_position3 = this.form.sign_position3;
    this.sendData.sign_name4 = this.form.sign_name4;
    this.sendData.sign_position4 = this.form.sign_position4;
  }

  onSubmit() {
    this.getDataForm();
    // this.sendData.report_template_field = this.getRowData();
    // this.sendData.report_group_field = this.groupFieldNameElement.getRowData();
    // this.sendData.report_order_field = this.orderFieldNameElement.getRowData();
    // this.sendData.report_grouping_field =
    //   this.reportGroupingElement.getRowData();

    // this.onSave();
    this.inputFormValidation.$el.requestSubmit();
  }

  onSubmitGrid() {
    this.inputFormValidationGrid.$el.requestSubmit();
  }

  async onSave() {
    this.isSaving = true
    let params: any = {
      daily_report: [],
      monthly_report: [],
      yearly_report: [],
      favorite_report: [],
    };
    let daily: any = await this.dailyElement.getRowData()
    if (daily.length > 0) {
      daily.forEach((element: any) => {
        params.daily_report.push({
          code: element.code,
          system_code: element.system_code
        });
      });
    }
    let monthly: any = await this.monthlyElement.getRowData()
    if (monthly.length > 0) {
      monthly.forEach((element: any) => {
        params.monthly_report.push({
          code: element.code,
          system_code: element.system_code
        });
      });
    }
    let yearly: any = await this.yearlyElement.getRowData()
    if (yearly.length > 0) {
      yearly.forEach((element: any) => {
        params.yearly_report.push({
          code: element.code,
          system_code: element.system_code
        });
      });
    }
    let favorite: any = await this.favoriteElement.getRowData()
    if (favorite.length > 0) {
      favorite.forEach((element: any) => {
        params.favorite_report.push({
          code: element.code,
          system_code: element.system_code
        });
      });
    }
    this.$emit("save", params);
  }
  onClose() {
    this.$emit("close");
    this.rowData = [];
  }

  handleDoubleClick() {
    this.form.amount = this.totalAmount;
  }

  onInvalidSubmitForm() {
    focusOnInvalid();
  }

  onInvalidSubmitGrid() {
    focusOnInvalid();
  }
  loadStatelist() { }

  getRowNodeId(params: any) {
    return params.id;
  }

  gridDragOver(event: any) {
    var dragSupported = event.dataTransfer.types.length;

    if (dragSupported) {
      event.dataTransfer.dropEffect = "copy";
      event.preventDefault();
    }
  }

  gridDrop(event: any, grid: any) {
    event.preventDefault();
    var jsonData = event.dataTransfer.getData("application/json");
    var data = JSON.parse(jsonData);
    (data.name = data.name),
      this.gridApi.applyTransaction({
        add: [data],
      });

    console.log(data);
  }

  gridFormCancel() {
    this.resetForm2();
    this.isSave = false;
    this.idGridEdit = 0;
  }

  handleEdit(params: any) {
    this.idGridEdit = params.idGrid;
    this.formData.item_data = params.item_code;
    this.formData.quantity = params.quantity;
    this.formData.uom = params.uom_code;
    this.formData.remark = params.remark;
    this.qtyConvertion = params.convertion;
    this.isSave = true;
  }

  handleSaveGrid() {
    if (this.isSave) {
      this.updateDataGrid();
    } else {
      let parameters = {
        item_data: this.formData.item_data,
        quantity: this.formData.quantity,
        uom: this.formData.uom,
        remark: this.formData.remark,
        convertion: this.qtyConvertion,
      };
      this.insertDataGrid(parameters, "");
    }
  }

  handleDelete(params: any) {
    this.gridApi.applyTransaction({
      remove: [params],
    });
    this.resetForm2();
  }

  countTotalAmount() {
    let tot = 0;
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      tot = tot + parseInt(rowNode.data.Amount);
    });
    this.totalAmount = tot;
  }

  updateDataGrid() {
    // if (this.checkTransactionID()) {
    let data = {
      idGrid: this.idGridEdit,
      item_code: this.formData.item_data,
      quantity: this.formData.quantity,
      uom_item: this.formData.uom,
      remark: this.formData.remark,
      convertion: this.qtyConvertion,
    };
    this.gridApi.applyTransaction({
      update: [data],
    });
    this.isSave = false;
    this.resetForm2();
    this.idGridEdit = 0;
    //   } else {
    //   getToastInfo(this.$t('messages.dataIsAlreadyExist'))
    // }
  }
  insertDataGrid(parameters: any, mode: string) {
    // if (this.form.transaction_id != undefined || mode == "load") {
    //   if (this.checkTransactionID()) {
    let idIncrement = this.idGrid + 1;
    this.idGrid = idIncrement;
    let data = {
      idGrid: idIncrement,
      item_code: parameters.item_data,
      quantity: parameters.quantity,
      uom_code: parameters.uom,
      convertion: parameters.convertion,
      remark: parameters.remark,
    };
    this.gridApi.applyTransaction({
      add: [data],
    });
    this.resetForm2();
    this.countTotalAmount();
    //   } else {
    //     getToastInfo(this.$t('messages.dataIsAlreadyExist'))
    //   }
    // } else {
    //   getToastInfo(this.$t('messages.selectAccount'))
    // }
  }

  setGrid(params: any, setMode: any) {
    if (setMode == "setFont") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue("font", params.node.data.font);
      });
    } else if (setMode == "setFontSize") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue("font_size", params.node.data.font_size);
      });
    } else if (setMode == "setFontColor") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue("font_color", params.node.data.font_color);
      });
    } else if (setMode == "setAlignment") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue("alignment", params.node.data.alignment);
      });
    } else if (setMode == "setHeaderFontSize") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue(
          "header_font_size",
          params.node.data.header_font_size
        );
      });
    } else if (setMode == "setHeaderFontColor") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue(
          "header_font_color",
          params.node.data.header_font_color
        );
      });
    } else if (setMode == "setHeaderFontAlignment") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue(
          "header_alignment",
          params.node.data.header_alignment
        );
      });
    } else if (setMode == "setAllProperties") {
      this.gridApi.forEachNode((rowNode: any, index: any) => {
        let rowNodeData = this.gridApi.getRowNode(rowNode.data.id);
        rowNodeData.setDataValue("font", params.node.data.font);
        rowNodeData.setDataValue("font_size", params.node.data.font_size);
        rowNodeData.setDataValue("font_color", params.node.data.font_color);
        rowNodeData.setDataValue("alignment", params.node.data.alignment);
        rowNodeData.setDataValue(
          "header_font_size",
          params.node.data.header_font_size
        );
        rowNodeData.setDataValue(
          "header_font_color",
          params.node.data.header_font_color
        );
        rowNodeData.setDataValue(
          "header_alignment",
          params.node.data.header_alignment
        );
      });
    }
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
        name: this.$t("commons.contextMenu.setToDaily"),
        action: () => this.dailyElement.insertGrid(params.node.data),
      },
      {
        name: this.$t("commons.contextMenu.setToMonthly"),
        action: () => this.monthlyElement.insertGrid(params.node.data),
      },
      {
        name: this.$t("commons.contextMenu.setToYearly"),
        action: () => this.yearlyElement.insertGrid(params.node.data),
      },
      {
        name: this.$t("commons.contextMenu.setToFavorite"),
        action: () => this.favoriteElement.insertGrid(params.node.data),
      }
    ];
    return result;
  }

  checkTransactionID() {
    let trans_id: any;
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      if (rowNode.data.TransactionID == this.form.transaction_id) {
        trans_id = rowNode.data.TransactionID;
      }
    });
    if (trans_id == undefined) {
      return true;
    } else if (this.isSave && this.dataEdited == this.form.transaction_id) {
      this.dataEdited = "";
      return true;
    } else {
      return false;
    }
  }
  uomConvertion() {
    this.listDropdown.uom.forEach((element: any) => {
      if ((this.formData.uom = element.uom_code)) {
        this.qtyConvertion = parseInt(element.quantity);
      }
    });
  }

  setId(rowData: any) {
    for (const i in rowData) {
      rowData[i].id = this.id++;
    }
    return rowData;
  }

  getRowData() {
    let id_sort: number = 1;
    let rowData: any = [];
    this.gridApi.forEachNode(function (node: any) {
      node.data.alignment = node.data.alignment.toString();
      node.data.header_alignment = node.data.header_alignment.toString();
      node.data.font = parseInt(node.data.font);
      node.data.font_size = parseInt(node.data.font_size);
      node.data.footer_type = parseInt(node.data.footer_type);
      node.data.format_code = parseInt(node.data.format_code);
      node.data.header_font_size = parseInt(node.data.header_font_size);
      node.data.width = parseInt(node.data.width);
      rowData.push(node.data);
    });

    for (const i in rowData) {
      rowData[i].id_sort = id_sort++;
    }

    let arr: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      arr.push({ quantity: rowNode.data.quantity });
    });
    this.totalFooter = arr;

    return rowData;
  }

  onInsert(data: any) {
    // this.availableListElement.rowData = data.ReportDefaultField ?? [];
  }

  onEdit(data: any) {
    this.form.template_name = data.ReportTemplate.name;
    this.form.header_remark = data.ReportTemplate.header_remark;
    this.form.show_footer = data.ReportTemplate.show_footer;
    this.form.show_page_number = data.ReportTemplate.show_page_number;
    this.form.paper_size = data.ReportTemplate.paper_size;
    this.form.width = data.ReportTemplate.paper_width;
    this.form.height = data.ReportTemplate.paper_height;
    if (data.ReportTemplate.is_portrait == 2) {
      this.form.is_portrait = 0
    } else {
      this.form.is_portrait = data.ReportTemplate.is_portrait;
    }
    this.form.header_height = data.ReportTemplate.header_row_height;
    this.form.data_height = data.ReportTemplate.row_height;
    this.form.horizontal_border = data.ReportTemplate.horizontal_border;
    this.form.vertical_border = data.ReportTemplate.vertical_border;
    this.form.sign_name1 = data.ReportTemplate.sign_name1;
    this.form.sign_position1 = data.ReportTemplate.sign_position1;
    this.form.sign_name2 = data.ReportTemplate.sign_name2;
    this.form.sign_position2 = data.ReportTemplate.sign_position2;
    this.form.sign_name3 = data.ReportTemplate.sign_name3;
    this.form.sign_position3 = data.ReportTemplate.sign_position3;
    this.form.sign_name4 = data.ReportTemplate.sign_name4;
    this.form.sign_position4 = data.ReportTemplate.sign_position4;

    this.rowData = this.setId(data.ReportTemplateField) ?? [];
    // this.availableListElement.rowData = data.ReportDefaultField ?? [];
    // this.reportGroupingElement.rowData = data.ReportGroupingField ?? [];
    // this.orderFieldNameElement.rowData = data.ReportOrderField ?? [];
    // this.groupFieldNameElement.rowData = data.ReportGroupField ?? [];
  }

  clearList() {
    console.log(this.getRowData());

    this.rowData = [];
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================

  onFilterTextBoxChanged() {
    if (this.gridApi) {
      this.gridApi.setQuickFilter(this.form.search);
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    const updateData = (data: any) => (this.rowData.value = data);

    updateData(this.rowData)
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async GetReportList() {
    try {
      let arr: any = []
      const { data } = await ReportAPI.GetReportList();
      for (const i in data.Report) {
        if (data.Report[i].parent_id > 0) {
          arr.push(data.Report[i])
        }
      }
      this.rowData = arr
      let ReportCustom: any = await this.GetReportCustomList()
      if (ReportCustom.DailyReport != null) {
        ReportCustom.DailyReport.forEach((element: any) => {
          this.dailyElement.insertGrid(element)
        });
      }
      if (ReportCustom.MonthlyReport != null) {
        ReportCustom.MonthlyReport.forEach((element: any) => {
          this.monthlyElement.insertGrid(element)
        });
      }
      if (ReportCustom.YearlyReport != null) {
        ReportCustom.YearlyReport.forEach((element: any) => {
          this.yearlyElement.insertGrid(element)
        });
      } if (ReportCustom.FavoriteReport != null) {
        ReportCustom.FavoriteReport.forEach((element: any) => {
          this.favoriteElement.insertGrid(element)
        });
      }
    } catch (error) {
      getError(error);
    }
  }

  async GetReportCustomList() {
    try {
      const { data } = await ReportAPI.GetReportCustomList();
      return data
    } catch (error) {
      getError(error);
      return null
    }
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      quickFilterText: '',
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
      },
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.fieldName"),
        field: "code",
        width: 250,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.fieldName"),
        field: "system_code",
        width: 250,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.fieldName"),
        field: "name",
        width: 230,
        dndSource: true,
      },
    ];
    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconLockRenderer: IconLockRenderer,
      statusBarTotalRenderer: StatusBarTotalRenderer,
      checklistRenderer: checklistRenderer,
      FootertypeDropdownRenderer: FootertypeDropdownRenderer,
      FormatDropdownRenderer: FormatDropdownRenderer,
      FontDropdownRenderer: FontDropdownRenderer,
      AlignmentDropdownRenderer: AlignmentDropdownRenderer,
      ColorDropdownRenderer: ColorDropdownRenderer,
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
    this.rowSelection = "single";
    this.rowModelType = "clientSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
  }
  mounted() {
    // this.gridApi = this.gridOptions.api;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER FUNCTION ======================================================
  get schema() {
    return Yup.object().shape({
      templateName: Yup.string().required(),
    });
  }
  get disabledActionGrid() {
    return this.isSave;
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

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.totalFooter, this.columnDefs);
  }

  get activeStore() {
    return this.config.activeStore;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
