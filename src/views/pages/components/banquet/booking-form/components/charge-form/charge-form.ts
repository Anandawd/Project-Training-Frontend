import { Options, Vue } from "vue-class-component";
import { AgGridVue } from "ag-grid-vue3";
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import $global from "@/utils/global";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import { ref, reactive } from "vue";
import CDialog from "@/components/dialog/dialog.vue";
import {
  formatDateTime,
  formatDateTimeUTC,
  formatNumber,
  formatTime,
  formatDate,
} from "@/utils/format";
import InputFormPackage from "./component/input-form-package/input-form-package.vue";
import InputFormProduct from "./component/input-form-product/input-form-product.vue";
import {
  cloneObject,
  generateIconContextMenuAgGrid,
  generateTotalFooterAgGrid,
  getError,
} from "@/utils/general";
import * as Yup from "yup";
import StatusBarTotalRenderer from "@/components/ag_grid-framework/statusbar_total.vue";
import BookingApi from "@/services/api/banquet/booking";
import { getToastSuccess } from "@/utils/toast";
import SearchFilter from "@/views/pages/components/filter/filter.vue";
import checklistVue from "@/components/ag_grid-framework/checklist.vue";
const bookingApi = new BookingApi();

@Options({
  components: {
    CCheckbox,
    AgGridVue,
    CDialog,
    InputFormPackage,
    SearchFilter,
    InputFormProduct,
  },
  props: {
    formType: {
      type: String,
      require: true,
    },
    bookingNumber: Number,
    focus: {
      type: Boolean,
      default: false,
    },
  },
  emits: [""],
})
export default class ChargeForm extends Vue {
  public rowData: any = [];
  public form: any = reactive({});
  public showDialog: boolean = false;
  public showFormPackage = false;
  public showFormProduct = false;
  public showFormType: number = 0;
  public modeData: any = 0;
  public isSaving: boolean = false;
  public formType: any = null;
  public inputFormPackageElement: any = ref();
  public inputFormProductElement: any = ref();
  isPackage: boolean;
  bookingNumber: number;
  folioNumber: number;
  ShowVoidCharge: boolean = false;
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
  async initialize(folioNumber: any) {
    this.folioNumber = folioNumber;
    await this.$nextTick();
    await this.refreshData();
    this.showFormProduct = false;
    this.showFormPackage = false;
  }

  async refreshData() {
    await this.loadDataCharge(this.ShowVoidCharge);
  }

  onPageSizeChanged(newPageSize: any) {
    this.gridApi.paginationSetPageSize(newPageSize);
  }

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
        // action: () => this.handleShowForm("", $global.modeData.insert),
      },
      {
        name: this.$t("commons.contextMenu.update"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("edit_icon24"),
        // action: () => this.handleEdit(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.delete"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("delete_icon24"),
        // action: () => this.handleDelete(this.paramsData),
      },
      {
        name: this.$t("commons.contextMenu.duplicate"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("duplicate_icon24"),
        // action: () => this.handleDuplicate(this.paramsData),
      },
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        // action: () => this.handleTrackingData(this.$global.tableName.cfgInitCardBank, this.paramsData.id),
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

  async handleShowForm(isPackage: any, mode: any) {
    this.isPackage = isPackage;
    this.modeData = mode;
    if (isPackage) {
      this.showFormPackage = true;
      this.showFormProduct = false;
      await this.$nextTick();
      this.inputFormPackageElement.initialize();
    } else {
      this.showFormProduct = true;
      await this.$nextTick();
      this.inputFormProductElement.initialize();
      this.showFormPackage = false;
    }
  }

  handleDelete(params: any) {
    this.showDialog = true;
    // this.deleteCode = params.code;
  }

  async handleEdit(params: any) {
    this.modeData = $global.modeData.edit;
    // await this.editData(params.code);
  }

  convertTimeToDateFormat(date: string, time: string) {
    const [timePart] = time.split("+");
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
  }

  async handleSave(formData: any) {
    this.isSaving = true;
    let savedData = cloneObject(formData);

    savedData.start_time = formatDateTimeUTC(
      this.convertTimeToDateFormat(savedData.served_date, savedData.start_time)
    );
    savedData.end_time = formatDateTimeUTC(
      this.convertTimeToDateFormat(savedData.served_date, savedData.end_time)
    );
    savedData.booking_number = this.bookingNumber;

    savedData.served_date = formatDateTimeUTC(savedData.served_date);
    if (this.modeData == $global.modeData.insert) {
      if (this.isPackage) {
        await this.insertDataPackage(savedData);
      } else {
        savedData.mode_editor = this.modeData;
        savedData.discount = savedData.discount_percent
          ? (savedData.discount * savedData.sub_total) / 100
          : savedData.discount;
        await this.insertDataProduct(savedData);
      }
    } else if (this.modeData == $global.modeData.edit) {
      // await this.updateData(formData);
    }
    this.isSaving = false;
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async loadDataCharge(ShowVoidCharge: boolean = this.ShowVoidCharge) {
    this.gridApi.showLoadingOverlay();
    try {
      const params = {
        ShowVoidCharge: ShowVoidCharge,
      };
      const { data } = await bookingApi.getBanReservationChargeList(
        params,
        this.bookingNumber
      );
      this.rowData = data;
    } catch (error: any) {
      this.rowData = [];
      getError(error);
    }

    setTimeout(() => {
      this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData);
    }, 200);
    this.gridApi.hideOverlay();
  }

  async insertDataProduct(formData: any) {
    try {
      const { status2 } = await bookingApi.insertBanquetProduct(formData);
      if (status2.status == 0) {
        this.showFormProduct = false;
        this.refreshData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
    } catch (error) {
      getError(error);
    }
  }

  async insertDataPackage(formData: any) {
    try {
      const { status2 } = await bookingApi.insertBookingReservationPackage(
        formData
      );
      if (status2.status == 0) {
        this.showFormPackage = false;
        // this.refreshData();
        getToastSuccess(this.$t("messages.saveSuccess"));
      }
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
        edit: true,
        void: true,
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
        width: 100,
        lockPosition: true,
        headerClass: "align-header-center",
        cellClass: "action-grid-buttons",
      },
      {
        headerName: this.$t("commons.table.posting"),
        field: "is_posting",
        width: 70,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
        cellRenderer: "checklist",
      },
      {
        headerName: this.$t("commons.table.venue"),
        field: "Venue",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.seatingPlan"),
        field: "SeatingPlan",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.servedTime"),
        field: "served_time",
        width: 100,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
        valueFormatter: formatTime,
        filterParams: {
          valueFormatter: formatTime,
        },
      },
      {
        headerName: this.$t("commons.table.resv#"),
        field: "reservation_number",
        width: 100,
      },
      {
        headerName: this.$t("commons.table.account"),
        field: "Account",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.product"),
        field: "Product",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.quantity"),
        field: "quantity",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.price"),
        field: "price",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.subTotal"),
        field: "SubTotal",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.discount"),
        field: "discount",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.amount"),
        field: "Amount",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.tax"),
        field: "tax",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.service"),
        field: "service",
        width: 100,
        cellStyle: { textAlign: "right" },
        headerClass: "align-header-right ",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        sumTotal: true,
      },
      {
        headerName: this.$t("commons.table.remark"),
        field: "remark",
        width: 130,
      },
      {
        headerName: this.$t("commons.table.company"),
        field: "Company",
        width: 120,
      },
      {
        headerName: this.$t("commons.table.auditDate"),
        field: "audit_date",
        width: 120,
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.postingDate"),
        field: "posting_date",
        width: 120,
        valueFormatter: formatDateTime,
        filterParams: {
          valueFormatter: formatDateTime,
        },
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
      },
      {
        headerName: this.$t("commons.table.void"),
        field: "void",
        width: 50,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center ",
        cellRenderer: "checklist",
      },
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
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      checklist: checklistVue,
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

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.ColumnApi = this.gridOptions.columnApi;
  }
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get disabledActionGrid() {
    return this.showFormPackage || this.showFormProduct;
  }

  get pinnedBottomRowData() {
    return generateTotalFooterAgGrid(this.rowData, this.columnDefs);
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      "Reservation Number": Yup.string().required(),
      venue: Yup.string().required(),
      Product: Yup.string().required(),
      Quantity: Yup.string().required(),
      Price: Yup.string().required(),
      "Sub Total": Yup.string().required(),
      amount: Yup.string().required(),
    });
  }
  // END GETTER AND SETTER ===========================================================
}
