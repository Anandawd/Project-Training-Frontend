import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { focusOnInvalid } from "@/utils/validation";
import { reactive, ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";

@Options({
  name: "InputForm",
  components: {
    Form,
    CSelect,
    CInput,
    QuillEditor,
    AgGridVue
  },
  props: {
    formType: {
      type: String,
      default: "",
      require: true,
    },
    modeData: {
      type: Number,
      require: true,
    },
    schema: {
      type: Object,
      require: true,
    },
    columnOptions: {
      type: Array,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["save", "close"],
})
export default class InputForm extends Vue {
  public defaultForm: any = reactive({});
  public form: any = reactive({});
  quill: any = ref()
  rowData: any = []
  public contentType: string = "html"
  isSaving: boolean = false;
  isDisable: boolean = true;
  inputFormElement: any = ref();
  modeData: any;
  listDropdown: any = {};
  messageEmail: boolean = true
  messageWhatsapp: boolean = false
  formatComboList: any = [
    { code: "H", name: "HTML" },
    { code: "P", name: "Plain" }
  ]
    // Ag grid variable
    detailRowAutoHeight: boolean = true;
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
    refresh: any;
  
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async resetForm() {
    this.inputFormElement.resetForm();
    await this.$nextTick();
  }

  initialize() {
    this.resetForm();
  }

  onEdit(params: any) {
    params.event_name = "Reservation Reminder"
    if (params.type_code == "E") {
      params.type_name = "Email"
    } else if (params.type_code == "W") {
      params.type_name = "Whatsapp"
    }
    this.quill.pasteHTML(params.message)
    this.form = params
    this.formatComboList
  }

  onSubmit() {
    this.inputFormElement.$el.requestSubmit();
  }

  onSave() {
    this.form.message = this.form.template_message
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangeFormat(event: any) {
    if (event.target.value == "H") {
      this.messageEmail = true
      this.messageWhatsapp = false
    }
    if (event.target.value == "P") {
      this.messageEmail = false
      this.messageWhatsapp = true
    }
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.columnDefs = [
      {
        field: "variable",
        cellStyle: { textAlign: "center" },
        flex: 1
      },
    ];
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
      autoSizeColumns: true
    };
    this.context = { componentParent: this };
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
    this.limitPageSize = this.agGridSetting.limitDefaultPageSize;
    this.ColumnApi = this.gridOptions.columnApi;
  }

  mounted() {
    this.rowData = [
      {variable: "%%RESERVATIONNUMBER%%"},
      {variable: "%%FOLIONUMBER%%"},
      {variable: "%%TITLE%%"},
      {variable: "%%FULLNAME%%"},
      {variable: "%%ARRIVALDATE%%"},
      {variable: "%%DEPARTUREDATE%%"},
      {variable: "%%ROOMTYPE%%"},
      {variable: "%%ROOMNUMBER%%"},
      {variable: "%%PHONE1%%"},
      {variable: "%%PHONE2%%"},
      {variable: "%%EMAIL%%"},
      {variable: "%%BIRTHDATE%%"},
      {variable: "%%BREAKFAST%%"},
      {variable: "%%HOTSPOTUSER%%"},
      {variable: "%%HOTSPOTPASSWORD%%"},
    ]
    // this.ColumnApi.sizeColumnsToFit()
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================

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
  // END GETTER AND SETTER ===========================================================
}
