import { Options, Vue } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
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
import AvailableFieldList from "./available-field-list/available-field-list.vue";
import GroupFieldName from "./group-field-name/group-field-name.vue";
import OrderFieldName from "./order-field-name/order-field-name.vue";
import ReportGrouping from "./report-grouping/report-grouping.vue";
import FootertypeDropdownRenderer from "../component/footertype-dropdown-renderer.vue";
import FormatDropdownRenderer from "../component/format-dropdown-renderer.vue";
import FontDropdownRenderer from "../component/font-dropdown-renderer.vue";
import AlignmentDropdownRenderer from "../component/alignment-dropdown-renderer.vue";
import ColorDropdownRenderer from "../component/color-dropdown-renderer.vue";

@Options({
  name: "ReportForm",
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
    AvailableFieldList,
    GroupFieldName,
    OrderFieldName,
    ReportGrouping,
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
export default class ReportForm extends Vue {
  inputFormValidation: any = ref();
  inputFormValidationGrid: any = ref();
  availableListElement: any = ref();
  reportGroupingElement: any = ref();
  orderFieldNameElement: any = ref();
  groupFieldNameElement: any = ref();
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
    this.rowData = [];
    this.form = {
      header_remark: "",
      paper_size: 1,
      width: this.paperSizeDefault[1].width,
      height: this.paperSizeDefault[1].height,
      header_height: 30,
      data_height: 20,
      is_portrait: 0,
      show_footer: 1,
      show_page_number: 1,
      horizontal_border: 1,
      vertical_border: 1,
      sign_name1: "",
      sign_section1: "",
      sign_position1: "",
      sign_name2: "",
      sign_section2: "",
      sign_position2: "",
      sign_name3: "",
      sign_section3: "",
      sign_position3: "",
      sign_name4: "",
      sign_section4: "",
      sign_position4: "",
    };
  }
  async resetForm2() {
    this.inputFormValidationGrid.resetForm();
    this.formData = {};
    this.qtyConvertion = 0;
  }

  initialize() {
    this.resetForm();
    this.availableListElement.rowData = [];
    this.reportGroupingElement.rowData = [];
    this.orderFieldNameElement.rowData = [];
    this.groupFieldNameElement.rowData = [];
  }

  getDataForm() {
    this.sendData.report_code = this.reportCode;
    this.sendData.name = this.form.template_name;
    this.sendData.group_level = this.reportGroupingElement.getRowData().length;
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
    this.sendData.sign_section1 = this.form.sign_section1;
    this.sendData.sign_position1 = this.form.sign_position1;
    this.sendData.sign_name2 = this.form.sign_name2;
    this.sendData.sign_section2 = this.form.sign_section2;
    this.sendData.sign_position2 = this.form.sign_position2;
    this.sendData.sign_name3 = this.form.sign_name3;
    this.sendData.sign_section3 = this.form.sign_section3;
    this.sendData.sign_position3 = this.form.sign_position3;
    this.sendData.sign_name4 = this.form.sign_name4;
    this.sendData.sign_section4 = this.form.sign_section4;
    this.sendData.sign_position4 = this.form.sign_position4;
  }

  onSubmit() {
    this.getDataForm();
    this.sendData.report_template_field = this.getRowData();
    this.sendData.report_group_field = this.groupFieldNameElement.getRowData();
    this.sendData.report_order_field = this.orderFieldNameElement.getRowData();
    this.sendData.report_grouping_field =
      this.reportGroupingElement.getRowData();

    // this.onSave();
    this.inputFormValidation.$el.requestSubmit();
  }

  onSubmitGrid() {
    this.inputFormValidationGrid.$el.requestSubmit();
  }

  onSave() {
    let array: any = [];
    // this.rowData.forEach((element: any) => {
    //   if (element.selected) {
    //     array.push({
    //       fa_code: element.fa_code,
    //       location_code: element.location_code
    //     });
    //   }
    // });
    // this.form.details = array
    // if (array.length != 0) {

    if (this.sendData.report_template_field.length > 0) {
      this.isSaving = true;
      this.$emit("save", this.sendData);
    } else {
      getToastError(this.$t("messages.insertItem"));
    }
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
  loadStatelist() {}

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
    (data.header_name = data.field_name),
      (data.footer_type = 0),
      (data.format_code = 0),
      (data.width = 100),
      (data.font = 0),
      (data.font_size = 9),
      (data.font_color = "#000000"),
      (data.alignment = 0),
      (data.header_font_size = 9),
      (data.header_font_color = "#000000"),
      (data.header_alignment = 0),
      (data.id = this.id++);
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
        name: this.$t("commons.contextMenu.deleteField"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.clearList"),
        action: () => this.clearList(),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.setFont"),
        action: () => this.setGrid(params, "setFont"),
      },
      {
        name: this.$t("commons.contextMenu.setFontSize"),
        action: () => this.setGrid(params, "setFontSize"),
      },
      {
        name: this.$t("commons.contextMenu.setFontColor"),
        action: () => this.setGrid(params, "setFontColor"),
      },
      {
        name: this.$t("commons.contextMenu.setAlignment"),
        action: () => this.setGrid(params, "setAlignment"),
      },
      {
        name: this.$t("commons.contextMenu.setHeaderFontSize"),
        action: () => this.setGrid(params, "setHeaderFontSize"),
      },
      {
        name: this.$t("commons.contextMenu.setHeaderFontColor"),
        action: () => this.setGrid(params, "setHeaderFontColor"),
      },
      {
        name: this.$t("commons.contextMenu.setHeaderFontAlignment"),
        action: () => this.setGrid(params, "setHeaderFontAlignment"),
      },
      {
        name: this.$t("commons.contextMenu.setAllProperties"),
        action: () => this.setGrid(params, "setAllProperties"),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.save"),
        action: () => this.onSubmit(),
      },
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
    this.availableListElement.rowData = data.ReportDefaultField ?? [];
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
      this.form.is_portrait = 0;
    } else {
      this.form.is_portrait = data.ReportTemplate.is_portrait;
    }
    this.form.header_height = data.ReportTemplate.header_row_height;
    this.form.data_height = data.ReportTemplate.row_height;
    this.form.horizontal_border = data.ReportTemplate.horizontal_border;
    this.form.vertical_border = data.ReportTemplate.vertical_border;
    this.form.sign_name1 = data.ReportTemplate.sign_name1;
    this.form.sign_position1 = data.ReportTemplate.sign_position1;
    this.form.sign_section1 = data.ReportTemplate.sign_section1;
    this.form.sign_name2 = data.ReportTemplate.sign_name2;
    this.form.sign_position2 = data.ReportTemplate.sign_position2;
    this.form.sign_section2 = data.ReportTemplate.sign_section2;
    this.form.sign_name3 = data.ReportTemplate.sign_name3;
    this.form.sign_position3 = data.ReportTemplate.sign_position3;
    this.form.sign_section3 = data.ReportTemplate.sign_section3;
    this.form.sign_name4 = data.ReportTemplate.sign_name4;
    this.form.sign_position4 = data.ReportTemplate.sign_position4;
    this.form.sign_section4 = data.ReportTemplate.sign_section4;

    this.rowData = this.setId(data.ReportTemplateField) ?? [];
    this.availableListElement.rowData = data.ReportDefaultField ?? [];
    this.reportGroupingElement.rowData = data.ReportGroupingField ?? [];
    this.orderFieldNameElement.rowData = data.ReportOrderField ?? [];
    this.groupFieldNameElement.rowData = data.ReportGroupField ?? [];
  }

  clearList() {
    console.log(this.getRowData());

    this.rowData = [];
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  handleChangePaperSize() {
    this.form.paper_size;
    if (this.form.paper_size === 1) {
      this.form.width = this.paperSizeDefault[1].width;
      this.form.height = this.paperSizeDefault[1].height;
    } else if (this.form.paper_size === 2) {
      this.form.width = this.paperSizeDefault[2].width;
      this.form.height = this.paperSizeDefault[2].height;
    } else if (this.form.paper_size === 3) {
      this.form.width = this.paperSizeDefault[3].width;
      this.form.height = this.paperSizeDefault[3].height;
    } else if (this.form.paper_size === 4) {
      this.form.width = this.paperSizeDefault[4].width;
      this.form.height = this.paperSizeDefault[4].height;
    }
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
      },
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.fieldName"),
        field: "id",
        width: 160,
        hide: true,
      },
      {
        headerName: this.$t("commons.table.fieldName"),
        field: "field_name",
        width: 160,
        rowDrag: true,
      },
      {
        headerName: this.$t("commons.table.headerName"),
        field: "header_name",
        width: 100,
        editable: true,
      },
      {
        headerName: this.$t("commons.table.footerType"),
        field: "footer_type",
        width: 90,
        cellEditor: "FootertypeDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 0) {
            return "(None)";
          } else if (params.value == 1) {
            return "Text 'TOTAL'";
          } else if (params.value == 2) {
            return "SUM";
          } else if (params.value == 3) {
            return "COUNT";
          } else if (params.value == 4) {
            return "COUNT IF <> ''";
          } else if (params.value == 5) {
            return "COUNT IF <> 0";
          }
        },
      },
      {
        headerName: this.$t("commons.table.format"),
        field: "format_code",
        width: 90,
        cellEditor: "FormatDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 0) {
            return "(None)";
          } else if (params.value == 1) {
            return "%2.0n";
          } else if (params.value == 2) {
            return "%2.1n";
          } else if (params.value == 3) {
            return "%2.2n";
          } else if (params.value == 4) {
            return "%2.3n";
          } else if (params.value == 5) {
            return "dd/mm/yyyy";
          } else if (params.value == 6) {
            return "dd/mm/yy";
          } else if (params.value == 7) {
            return "dd-mm-yyyy";
          } else if (params.value == 8) {
            return "dd-mm-yy";
          } else if (params.value == 9) {
            return "dd/mm/yyyy hh:mm:ss";
          } else if (params.value == 10) {
            return "yyyy/mm/dd hh:mm:ss";
          } else if (params.value == 11) {
            return "dd/mm/yyyy hh:mm";
          } else if (params.value == 12) {
            return "yyyy/mm/dd";
          } else if (params.value == 13) {
            return "hh:mm:ss";
          } else if (params.value == 14) {
            return "hh:mm";
          }
        },
      },
      {
        headerName: this.$t("commons.table.width"),
        field: "width",
        width: 60,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        editable: true,
      },
      {
        headerName: this.$t("commons.table.font"),
        field: "font",
        width: 60,
        cellEditor: "FontDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 0) {
            return "Arial";
          } else if (params.value == 1) {
            return "Tahoma";
          } else if (params.value == 2) {
            return "Verdana";
          } else if (params.value == 3) {
            return "Microsoft Sans Serif";
          } else if (params.value == 4) {
            return "Times New Roman";
          } else if (params.value == 5) {
            return "Comic Sans MS";
          } else if (params.value == 6) {
            return "Lucida Console";
          }
        },
      },
      {
        headerName: this.$t("commons.table.fontSize"),
        field: "font_size",
        width: 80,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        editable: true,
      },
      {
        headerName: this.$t("commons.table.fontColor"),
        field: "font_color",
        width: 90,
        cellEditor: "ColorDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 0) {
            return "<span style='padding-left: 5px; border-left: 10px solid #000000;'>#000000</span>";
          } else {
            return (
              "<span style='padding-left: 5px; border-left: 10px solid " +
              params.value +
              ";'>" +
              params.value +
              "</span>"
            );
          }
        },
      },
      {
        headerName: this.$t("commons.table.alignment"),
        field: "alignment",
        width: 90,
        cellEditor: "AlignmentDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 0) {
            return "Left";
          } else if (params.value == 1) {
            return "Right";
          } else if (params.value == 2) {
            return "Center";
          }
        },
      },
      {
        headerName: this.$t("commons.table.headerFontSize"),
        field: "header_font_size",
        width: 125,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        editable: true,
      },
      {
        headerName: this.$t("commons.table.headerFontColor"),
        field: "header_font_color",
        width: 125,
        cellEditor: "ColorDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 0) {
            return "<span style='padding-left: 5px; border-left: 10px solid #000000;'>#000000</span>";
          } else {
            return (
              "<span style='padding-left: 5px; border-left: 10px solid " +
              params.value +
              ";'>" +
              params.value +
              "</span>"
            );
          }
        },
      },
      {
        headerName: this.$t("commons.table.headerAlignment"),
        field: "header_alignment",
        width: 125,
        cellEditor: "AlignmentDropdownRenderer",
        cellEditorPopup: true,
        editable: true,
        cellRenderer: (params: any) => {
          if (params.value == 0) {
            return "Left";
          } else if (params.value == 1) {
            return "Right";
          } else if (params.value == 2) {
            return "Center";
          }
        },
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
    this.gridApi = this.gridOptions.api;
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
