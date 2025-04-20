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
import InsertForm from "./insert-form/insert-form.vue";
import { AgGridVue } from "ag-grid-vue3";
import configStore from "@/stores/config";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconLockRenderer from "@/components/ag_grid-framework/lock_icon.vue";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import checklistRenderer from "../component/checklist-renderer.vue";
import FootertypeDropdownRenderer from "../component/footertype-dropdown-renderer.vue";
import FormatDropdownRenderer from "../component/format-dropdown-renderer.vue";
import FontDropdownRenderer from "../component/font-dropdown-renderer.vue";
import AlignmentDropdownRenderer from "../component/alignment-dropdown-renderer.vue";
import ColorDropdownRenderer from "../component/color-dropdown-renderer.vue";
import reportAPI from "@/services/api/report/report-module";

const ReportAPI = new reportAPI();

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
    InsertForm,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
  },
  emits: ["save", "close"],
})
export default class CreateDefaultFieldForm extends Vue {
  inputFormValidation: any = ref();
  inputFormValidationGrid: any = ref();
  inputFormElement: any = ref();
  modeData: any;

  public reportCode: any;
  public config = configStore();
  public defaultForm: any = {};
  public form: any = reactive({});
  public isOther: boolean = true;
  public rowData: any = [];
  public isSave: boolean = false;
  public showFormInput: boolean = false;
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
      query: "",
    };
  }
  async resetForm2() {
    this.inputFormValidationGrid.resetForm();
    this.formData = {};
    this.qtyConvertion = 0;
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.InsertReportDefaultField();
  }

  onSubmitGrid() {
    this.inputFormValidationGrid.$el.requestSubmit();
  }

  onSave() {
    let array: any = [];

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

  async handleShowFormInput() {
    this.showFormInput = true;
    await this.inputFormElement.initialize();
  }

  handleSaveInsertForm(data: any) {
    let rowData = this.getRowData();
    this.showFormInput = false;
    console.log(data);
    this.rowData = this.insertAndSortByIDSort(rowData, data);
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

  insertAndSortByIDSort(arr: any, newItem: any) {
    // Insert the new item into the array
    arr.push(newItem);

    // Sort the array by IDSort in ascending order
    arr.sort((a: any, b: any) => a.IDSort - b.IDSort);

    return arr;
  }

  formatSendData(arr: any) {
    // Loop through the array and update each object's IDSort based on its index
    return arr.map((item: any, index: any) => ({
      field_query: item.FieldQuery,
      field_name: item.FieldName,
      id_sort: index + 1,
      report_code: item.ReportCode,
    }));
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
    let rowData: any = [];
    this.gridApi.forEachNode(function (node: any) {
      rowData.push(node.data);
    });

    let arr: any = [];
    this.gridApi.forEachNode((rowNode: any, index: any) => {
      arr.push({ quantity: rowNode.data.quantity });
    });
    this.totalFooter = arr;
    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);

    return rowData;
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
    this.form.sign_name2 = data.ReportTemplate.sign_name2;
    this.form.sign_position2 = data.ReportTemplate.sign_position2;
    this.form.sign_name3 = data.ReportTemplate.sign_name3;
    this.form.sign_position3 = data.ReportTemplate.sign_position3;
    this.form.sign_name4 = data.ReportTemplate.sign_name4;
    this.form.sign_position4 = data.ReportTemplate.sign_position4;

    this.rowData = this.setId(data.ReportTemplateField) ?? [];
  }

  clearList() {
    console.log(this.getRowData());

    this.rowData = [];
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async InsertReportDefaultField() {
    let queryData = this.form.query.replace(/\n/g, "\r\n");

    console.log(queryData);
    let rowData: any = this.getRowData();
    let sendData: any = {
      query_string: queryData,
      default_field: this.formatSendData(rowData),
    };

    console.log(sendData);

    try {
      const { data } = await ReportAPI.InsertCreateDefaultField(sendData);
      getToastSuccess("Data Saved");
      // this.createDefaultFieldElement.form.query = data.QueryString
      // this.createDefaultFieldElement.rowData = data.DefaultField
    } catch (error) {
      getError(error);
    }
  }
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
        field: "FieldName",
        width: 350,
        rowDrag: true,
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

  getContextMenu(params: any) {
    const { node } = params;

    if (node) {
      this.paramsData = node.data;
    } else {
      this.paramsData = null;
    }
    const result = [
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        action: () => this.handleDelete(this.paramsData),
      },
    ];
    return result;
  }

  get activeStore() {
    return this.config.activeStore;
  }
  // END GETTER AND SETTER FUNCTION ==================================================
}
