import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import $global from "@/utils/global";
import Checkbox from "@/components/checkbox/checkbox.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CRadio from "@/components/radio/radio.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
// import myUpload from 'vue-image-crop-upload';
import { ref, h, reactive } from "vue";
import * as Yup from "yup";
import "vue3-colorpicker/style.css";
import BookingApi from "@/services/api/banquet/booking";
import {
  anyToFloat,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import { formatDateDatabase, formatNumber } from "@/utils/format";
const bookingApi = new BookingApi();

@Options({
  name: "InputFormPackage",
  components: {
    Form,
    CRadio,
    CSelect,
    CDatepicker,
    CInput,
    Checkbox,
    CCheckbox,
    // myUpload,
    AgGridVue,
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
    columnOptions: {
      type: Array,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
    bookingNumber: Number,
    focus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["save", "close"],
})
export default class InputFormPackage extends Vue {
  isSaving: boolean = false;
  isDisable: boolean = true;
  inputFormPackageElement: any = ref();
  modeData: any;
  columnOptions: any;
  public form: any = reactive({});
  bookingNumber: number;
  public colorFormElement: any = ref();
  href: string;
  copiedImg: string = "";
  show: boolean = false;
  imgDataUrl: string = "";
  listDropdown: any = {};
  isWidgetValue: boolean = false;
  handler: any;
  rowData: any = [];
  public pureColor: any;
  public gradientColor: any = ref(
    "linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)"
  );
  public formType: any;
  comboList: any = [];
  packageList: any = [];
  ColumnResOptions = [
    {
      label: "number",
      field: "Number",
      align: "left",
      width: "75",
      filter: true,
    },
    {
      label: "venue",
      field: "Venue",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "date",
      field: "Date",
      align: "left",
      width: "150",
      format: "date",
      filter: true,
    },
    {
      label: "startTime",
      field: "Start Time",
      align: "left",
      width: "100",
      filter: true,
    },
    {
      label: "endTime",
      field: "End Time",
      align: "left",
      width: "100",
      filter: true,
    },
  ];
  hasBnsSource: boolean = false;
  // accountList: any = [];
  focus: boolean;
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
  onChangeReservation() {
    const selectedRes = this.comboList.Reservation.find(
      (el: any) => el.Number == this.form.reservation_number
    );
    this.form.served_date = selectedRes.Date;
    this.form.start_time = selectedRes["Start Time"] + this.getTimezoneOffset();
    this.form.end_time = selectedRes["End Time"] + this.getTimezoneOffset();
    this.form.venue_code = selectedRes.VenueCode;
  }

  async onChangeBnsSource(ev: any) {
    this.hasBnsSource = !!ev.target.value;
    await this.loadPackageList();
    if (this.form.package_code) {
      await this.getAccountDropdownList(
        this.form.package_code,
        ev.target.value
      );
    }
  }

  onChangeStartTime() {
    if (this.form.start_time > this.form.end_time) {
      this.form.end_time = this.form.start_time;
    }
  }

  onChangeEndTime() {
    if (this.form.start_time > this.form.end_time) {
      this.form.start_time = this.form.end_time;
    }
  }

  getTimezoneOffset() {
    const date = new Date();
    const offsetInMinutes = date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
    const offsetMinutes = Math.abs(offsetInMinutes % 60);
    const offsetSign = offsetInMinutes < 0 ? "+" : "-";
    const timezoneString = `${offsetSign}${String(offsetHours).padStart(
      2,
      "0"
    )}${String(offsetMinutes).padStart(2, "0")}`;

    return timezoneString;
  }

  convertTimeToDateFormat(date: string, time: string) {
    const [timePart] = time.split("+");
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  }

  async onChangePackage(ev: any) {
    if (this.form.package_code) {
      const selectedPackage = this.packageList.find(
        (param: any) => param.code == ev.target.value
      );
      this.insertDataGrid(selectedPackage);
    } else {
      this.handleDeleteRowData();
    }
    if (this.form.business_source_code) {
      await this.getAccountDropdownList(
        ev.target.value,
        this.form.business_source_code
      );
    }
  }

  async getAccountDropdownList(packageCode: string, bnsSCode: string) {
    await this.loadAccountList(packageCode, bnsSCode);
  }

  getRowNodeId(params: any) {
    return params.name;
  }

  insertDataGrid(params: any) {
    let data = {
      name: params.name,
      quantity: params.quantity,
      amount: params.amount,
      remark: params.remark,
    };

    const rowData = this.getRowData();
    if (rowData.length > 0) {
      this.gridApi.applyTransaction({
        update: [data],
      });
      return;
    }

    this.gridApi.applyTransaction({
      add: [data],
    });
  }

  handleDeleteRowData() {
    this.gridApi.applyTransaction({
      remove: this.rowData,
    });
  }

  getRowData() {
    let rowData: any = [];
    this.gridApi.forEachNode((node: any) => rowData.push(node.data));

    this.rowData = rowData;

    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
    return rowData;
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async resetForm() {
    this.inputFormPackageElement.resetForm();
    await this.$nextTick(() => {
      this.form.adult = 1;
      this.form.child = 0;
      this.form.is_posting = 0;
      this.form.amount = 0;
      this.form.quantity = 0;
      this.form.commission_value = 0;
      this.form.layout_id = 0;
      this.imgDataUrl = "";
      this.packageList = [];
    });

    setInputFocus();
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormPackageElement.$el.requestSubmit();
  }

  onSave() {
    if (this.formType == this.$global.formType.seatingPlan) {
      this.form.image = btoa(this.imgDataUrl);
    }
    const selectedRowData = this.getRowData();
    this.form.served_date = formatDateDatabase(this.form.served_date);
    this.form.is_posting = this.form.is_posting ?? 0;
    this.form.child = this.form.child ?? 0;
    this.form.layout_id = anyToFloat(this.form.layout_id);
    this.form.remark = selectedRowData[0].remark ?? "";

    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  // for add image in input form
  onClickResetImage() {
    this.imgDataUrl = "";
  }

  toggleShow() {
    this.show = !this.show;
  }

  cropSuccess(imgDataUrl: any, field: any) {
    this.imgDataUrl = imgDataUrl;
    this.href = imgDataUrl;
  }

  onContextMenu(e: MouseEvent) {
    //prevent the browser's default menu
    e.preventDefault();
    //show our menu
    this.$contextmenu({
      x: e.x,
      y: e.y,
      items: [
        {
          label: "Copy",
          onClick: () => {
            this.copyImage(this.imgDataUrl);
          },
          icon: h("img", {
            src: "/public/images/icons/add_icon24.png",
            style: {
              width: "20px",
              height: "20px",
            },
          }),
          disabled: this.imgDataUrl == "" ? true : false,
        },
        {
          label: "Paste",
          onClick: () => {
            this.pasteImage(this.copiedImg);
          },
          icon: h("img", {
            src: "/public/images/icons/add_icon24.png",
            style: {
              width: "20px",
              height: "20px",
            },
          }),
          disabled: this.copiedImg == "" ? true : false,
        },
        {
          label: "Delete",
          onClick: () => {
            this.onClickResetImage();
          },
          icon: h("img", {
            src: "/public/images/icons/delete_icon24.png",
            style: {
              width: "20px",
              height: "20px",
            },
          }),
          disabled: this.imgDataUrl == "" ? true : false,
          divided: true,
        },
        {
          label: "Load",
          onClick: () => {
            this.toggleShow();
          },
          icon: h("img", {
            src: "/public/images/icons/add_icon24.png",
            style: {
              width: "20px",
              height: "20px",
            },
          }),
        },
        {
          label: "Save As",
          onClick: () => {
            this.saveAs();
          },
          icon: h("img", {
            src: "/public/images/icons/add_icon24.png",
            style: {
              width: "20px",
              height: "20px",
            },
          }),
          disabled: this.imgDataUrl == "" ? true : false,
        },
      ],
    });
  }

  copyImage(img: string) {
    this.copiedImg = `${img}`;
  }

  pasteImage(img: string) {
    this.imgDataUrl = img;
  }

  async saveAs() {
    const linkSource = this.imgDataUrl;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = "RoomView";
    downloadLink.click();
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadPackageComboList() {
    try {
      const { data } = await bookingApi.bookingReservationPackageComboList(
        this.bookingNumber
      );
      this.comboList = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadPackageList(bnsSCode: any = this.form.business_source_code) {
    try {
      let param = {
        business_source_code: bnsSCode,
      };
      const { data } = await bookingApi.bookingReservationPackageList(param);
      this.packageList = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadAccountList(
    packageCode: any = this.form.package_code,
    companyCode: any = this.form.business_source_code
  ) {
    try {
      let param = {
        PackageCode: packageCode,
        CompanyCode: companyCode,
      };
      const { data } = await bookingApi.getPackageBusinessSourceCommission(
        param
      );
      // this.accountList = data
      this.form.account_code = data.account_code;
    } catch (error) {
      getError(error);
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  beforeMount() {
    this.agGridSetting = $global.agGrid;
    this.gridOptions = {
      actionGrid: {
        menu: true,
        insert: true,
        delete: true,
        edit: true,
      },
      rowHeight: $global.agGrid.rowHeightDefault,
      headerHeight: $global.agGrid.headerHeight,
    };
    this.columnDefs = [
      { headerName: this.$t("commons.table.name"), field: "name", width: 120 },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 120,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "amount",
        width: 120,
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right",
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 120,
      },
    ];

    this.context = { componentParent: this };
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
    // this.loadData(this.searchDefault);
  }

  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.packageTransaction"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.packageTransaction"
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        "commons.packageTransaction"
      )}`;
    }
  }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  // VALIDATION
  get schema() {
    return Yup.object().shape({
      "Reservation Number": Yup.string().required(),
      Venue: Yup.string().required(),
      Package: Yup.string().required(),
      // Quantity: Yup.string().required(),
      // Price: Yup.string().required(),
      // "Sub Total": Yup.string().required(),
      Account: this.form.business_source_code ? Yup.string().required() : null,
      adult: Yup.number().required().min(1),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
