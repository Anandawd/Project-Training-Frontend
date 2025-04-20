import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";

//component ag-grid
import ActionGrid from "@/components/ag_grid-framework/action_grid.vue";
import IconCompHuRenderer from "@/components/ag_grid-framework/comp_hu_icon.vue";
import { generateIconContextMenuAgGrid, getError } from "@/utils/general";

import { AgGridVue } from "ag-grid-vue3";
import "ag-grid-enterprise";
import $global from "@/utils/global";
import configStore from "@/stores/config";
import { Form } from "vee-validate";
import * as Yup from "yup";
import {
  formatNumber,
  formatDate,
  formatDateDatabase,
  formatDateTimeUTC,
} from "@/utils/format";
import RegistrationFormAPI from "@/services/api/hotel/registration-form/registration-form";
import { ref } from "vue";
import { getToastSuccess } from "@/utils/toast";
import trackingDataStore from "@/stores/tracking-data";
const registrationFormAPI = new RegistrationFormAPI();
@Options({
  components: {
    CSelect,
    CDatepicker,
    CInput,
    AgGridVue,
    Form,
  },
  props: {
    param: {
      type: Number,
      require: true,
    },
    userAccess: Object,
    isReservation: Boolean,
    idData: Object,
  },
})
export default class ScheduledRate extends Vue {
  public param: number;
  public idData: any;
  public dialogElement: any = ref();
  public inputForm: any = ref();
  public config: any = configStore();
  public isSaving: boolean = false;
  public paramsData: any;
  public showDialog = false;
  public rowData: any[] = [];
  public reservationNumber: string | number = "";
  public showForm: boolean = false;
  public mode: string | number = 0;
  public isReservation: any = false;
  public form: any = {};
  public options: any = {
    complimentTypes: [
      { code: "N", name: "None" },
      { code: "H", name: "House Use" },
      { code: "P", name: "Compliment" },
    ],
  };

  // AG GRID Variable
  gridOptions: any;
  rowClassRules: any;
  columnDefs: any[];
  context: any;
  frameworkComponents: any;
  rowGroupPanelShow: string;
  statusBar: any = {};
  paginationPageSize: number;
  rowSelection: string;
  rowModelType: string;
  public bottomRowTotal: any;
  total: any;
  gridApi: any;

  beforeMount() {
    this.gridOptions = {
      actionGrid: {
        menu: true,
        edit: true,
        delete: true,
      },
      ...$global.agGrid.defaultGridOptions,
      // }
    };
    this.columnDefs = [
      {
        headerName: this.$t("commons.table.action"),
        resizable: false,
        filter: false,
        editable: false,
        suppressMovable: true,
        suppressMenu: true,
        sortable: false,
        cellRenderer: "actionGrid",
        colId: "params",
        headerClass: "align-header-center-suppress-menu",
        width: 100,
      },
      {
        headerName: this.$t("scheduledRate.table.complimentIcon"),
        field: "compliment_hu",
        width: 50,
        cellStyle: { textAlign: "center" },
        headerClass: "align-header-center",
        cellRenderer: "iconCompHuRenderer",
      },
      {
        headerName: this.$t("scheduledRate.table.startDate"),
        field: "from_date",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        width: 100,
      },
      {
        headerName: this.$t("scheduledRate.table.endDate"),
        field: "to_date",
        valueFormatter: formatDate,
        filterParams: {
          valueFormatter: formatDate,
        },
        width: 100,
      },
      {
        headerName: this.$t("scheduledRate.table.roomRate"),
        field: "RoomRate",
        width: 200,
      },
      {
        headerName: this.$t("scheduledRate.table.rate"),
        field: "rate",
        width: 150,
        headerClass: "align-header-right",
        cellStyle: { textAlign: "right" },
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
      },
      {
        headerName: this.$t("scheduledRate.table.compliment"),
        field: "compliment_hu",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.createdBy"),
        field: "created_by",
        width: 150,
      },
      {
        headerName: this.$t("commons.table.updatedBy"),
        field: "updated_by",
        width: 150,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
    this.frameworkComponents = {
      actionGrid: ActionGrid,
      iconCompHuRenderer: IconCompHuRenderer,
    };
    this.rowGroupPanelShow = "always";
    this.statusBar = $global.agGrid.statusBar;
    this.paginationPageSize = $global.agGrid.limitDefaultPageSize;
    this.rowSelection = "single";
    this.rowModelType = "serverSide";
  }

  mounted(): void {
    this.initialize();
  }

  initialize() {
    this.rowData = [];
    this.resetForm();
    this.getScheduledRateList();
  }

  onGridReady() {
    this.bottomRowTotal = this.total;
  }

  onPageSizeChanged(newPageSize: number) {
    this.gridApi.paginationSetPageSize(newPageSize);
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
        action: () => this.handleInsert(),
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
      "separator",
      {
        name: this.$t("commons.contextMenu.trackingData"),
        disabled: !this.paramsData,
        icon: generateIconContextMenuAgGrid("tracking_icon24"),
        action: () =>
          this.handleTrackingData(
            $global.tableName.guestScheduledRate,
            this.paramsData.id
          ),
      },
    ];
    return result;
  }

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

  onClickInsert() {
    this.resetForm();
    this.handleInsert();
  }

  onRefreshData() {
    //
  }

  handleDelete(params: any) {
    this.paramsData = params;
    this.showDialog = true;
  }

  handleInsert() {
    this.mode = $global.modeData.insert;
    this.showForm = true;
    if (this.idData) {
      this.getRoomRate();
    }
  }

  async handleEdit(params: any) {
    this.mode = $global.modeData.edit;
    await this.getScheduledRate(params.id);
    this.getRoomRate();
    this.showForm = true;
  }

  handleTrackingData(tableName: number, id: number) {
    const trackingData = trackingDataStore();
    trackingData.show(tableName, id);
  }

  onChangeComplimentType() {
    if (this.form.compliment_hu == "H" || this.form.compliment_hu == "C") {
      this.form.rate = 0;
    }
  }

  async onSave() {
    this.isSaving = true;
    if (this.mode == $global.modeData.edit) {
      await this.updateScheduledRate();
    } else {
      await this.insertScheduledRate();
    }
    this.isSaving = false;
  }

  onClickSave() {
    this.inputForm.$el.requestSubmit();
  }

  onChangeFromDate() {
    this.form.to_date =
      this.form.to_date < this.form.from_date
        ? this.form.from_date
        : this.form.to_date;
  }

  onChangeRoomRate() {
    this.getRoomRateAmount();
  }

  async resetForm() {
    this.inputForm.resetForm();
    await this.$nextTick();
    if (this.idData) {
      this.form = {
        from_date: formatDateDatabase(this.idData.GuestDetailData.arrival),
        to_date: formatDateDatabase(this.idData.GuestDetailData.arrival),
        rate: 0,
        compliment_hu: "N",
      };
    }
  }

  fromDateDisabled(date: any) {
    const arrival = new Date(this.idData.GuestDetailData.arrival);
    const departure = new Date(this.idData.GuestDetailData.departure);
    arrival.setDate(arrival.getDate() - 1);
    departure.setDate(departure.getDate() - 1);
    return date < arrival || date > departure;
  }

  toDateDisabled(date: any) {
    const fromDate = new Date(this.form.from_date);
    const departure = new Date(this.idData.GuestDetailData.departure);
    fromDate.setDate(fromDate.getDate() - 1);
    departure.setDate(departure.getDate() - 1);
    return date < fromDate || date > departure;
  }

  public async getRoomRate() {
    if (!this.idData) return;
    const params = {
      RoomTypeCode: this.idData.GuestDetailData.room_type_code,
      BusinessSourceCode: this.idData.GuestDetailData.business_source_code,
      MarketCode: this.idData.GuestDetailData.market_code,
      CompanyCode: this.idData.GuestProfileData1.company_code,
      ArrivalDate: formatDateTimeUTC(this.idData.GuestDetailData.arrival),
    };
    try {
      const { data } = await registrationFormAPI.getRoomRate(params);
      this.options.roomRates = data ? data : [];
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getRoomRateAmount() {
    try {
      const params = {
        RoomRateCode: this.form.room_rate_code,
        PostingDateStr: formatDateTimeUTC(this.form.from_date),
        Adult: this.idData.GuestDetailData.adult,
        Child: this.idData.GuestDetailData.child,
      };
      const { data } = await registrationFormAPI.getRoomRateAmount(params);
      this.form.rate = data.weekday_rate;
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getScheduledRateList() {
    try {
      const { data } = await registrationFormAPI.getScheduledRateList(
        this.isReservation,
        this.param
      );
      this.rowData = data ? data : [];
      this.$emit("getScheduledRateList", this.rowData);
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getScheduledRate(Id: number) {
    try {
      const { data } = await registrationFormAPI.getScheduledRate(
        this.isReservation,
        Id
      );
      this.form = data;
      this.form.from_date = formatDateDatabase(data.from_date);
      this.form.to_date = formatDateDatabase(data.to_date);
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async insertScheduledRate() {
    try {
      this.form.number = this.param;
      this.form.from_date = formatDateTimeUTC(this.form.from_date);
      this.form.to_date = formatDateTimeUTC(this.form.to_date);
      this.form.rate = parseFloat(this.form.rate);
      await registrationFormAPI.insertScheduledRate(
        this.isReservation,
        this.form
      );
      this.getScheduledRateList();
      this.showForm = false;
      getToastSuccess();
    } catch (error: any) {
      this.isSaving = false;
      throw getError(error);
    }
  }

  public async updateScheduledRate() {
    try {
      this.form.number = this.param;
      this.form.from_date = formatDateTimeUTC(this.form.from_date);
      this.form.to_date = formatDateTimeUTC(this.form.to_date);
      this.form.rate = parseFloat(this.form.rate);
      await registrationFormAPI.updateScheduledRate(
        this.isReservation,
        this.form
      );
      this.getScheduledRateList();
      this.showForm = false;
      getToastSuccess();
    } catch (error: any) {
      this.isSaving = false;
      throw getError(error);
    }
  }

  public async deleteScheduledRate() {
    try {
      await registrationFormAPI.deleteScheduledRate(
        this.isReservation,
        this.paramsData.id
      );
      this.getScheduledRateList();
      getToastSuccess(this.$t("messages.deleteSuccess"));
    } catch (error: any) {
      throw getError(error);
    }
  }

  get auditDate() {
    return this.config.auditDate;
  }
  //Validation
  get schema() {
    return Yup.object().shape({
      compliment: Yup.string().required(),
      "Start date": Yup.date().required(),
      "End date": Yup.date().required(),
      "Room rate": Yup.string().required(),
      rate: Yup.number().required(),
    });
  }
}
