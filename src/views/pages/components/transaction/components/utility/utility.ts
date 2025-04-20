import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";

import { AgGridVue } from "ag-grid-vue3";
import { formatNumber } from "@/utils/format";
import $global from "@/utils/global";
import TransactionAPI from "@/services/api/transaction";
import * as Yup from "yup";
import configStore from "@/stores/config";
import { anyToFloat, getError } from "@/utils/general";
import { reactive, ref } from "vue";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import BookingApi from "@/services/api/banquet/booking";
const bookingApi = new BookingApi();
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CSelect,
    CInput,
    AgGridVue,
  },
  props: {
    transactionType: String,
    formType: String,
    bookingNumber: Number,
    folioNumber: Number,
    roomNumber: String,
  },
  emits: ["close", "save"],
})
export default class PackageForm extends Vue {
  public config = configStore();
  public rowData: any = [];
  public formPackageElement: any = ref(null);
  public isSaving: boolean = false;
  public form: any = reactive({});
  public options: any = {
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
    cardType: [],
    businessSource: [],
    commissionTypes: [],
    packages: [],
  };
  formType: string;
  bookingNumber: number;
  folioNumber: number;
  roomNumber: string;
  hasBnsSource: boolean = false;
  ColumnResOptions = [
    {
      label: "number",
      field: "Number",
      align: "left",
      width: "75",
    },
    {
      label: "venue",
      field: "Venue",
      align: "left",
      width: "100",
    },
    {
      label: "date",
      field: "Date",
      align: "left",
      width: "150",
      format: "date",
    },
    {
      label: "startTime",
      field: "Start Time",
      align: "left",
      width: "100",
    },
    {
      label: "endTime",
      field: "End Time",
      align: "left",
      width: "100",
    },
  ];
  packageList: any = [];
  gridOptions: any = {};
  global: any;
  columnDefs: any = [];
  context: any;
  rowSelection: string;
  rowModelType: string;
  gridApi: any;
  gridColumnApi: any;
  comboList: any = [];

  beforeMount() {
    this.gridOptions = {
      rowHeight: $global.agGrid.rowHeightDefault,
    };
    // ------------------need setting manual for column table-----------------//
    // use this.$t("value") for transaltion localization------//
    // see value in @/lang/en.js //
    this.columnDefs = [
      {
        headerName: this.$t("transaction.table.name"),
        field: "name",
        width: 250,
        enableRowGroup: false,
        suppressMenu: true,
        filter: false,
        sortable: false,
        rowGroup: false,
      },
      {
        headerName: this.$t("transaction.table.quantity"),
        field: "quantity",
        width: 115,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        enableRowGroup: false,
        suppressMenu: true,
        filter: false,
        sortable: false,
        rowGroup: false,
      },
      {
        headerName: this.$t("transaction.table.amount"),
        field: "amount",
        width: 115,
        type: "numericColumn",
        valueFormatter: formatNumber,
        filterParams: {
          valueFormatter: formatNumber,
        },
        enableRowGroup: false,
        suppressMenu: true,
        filter: false,
        sortable: false,
        rowGroup: false,
      },
      {
        headerName: this.$t("transaction.table.amountType"),
        field: "amount_type",
        width: 115,
        enableRowGroup: false,
        suppressMenu: true,
        filter: false,
        sortable: false,
        rowGroup: false,
      },
      {
        headerName: this.$t("transaction.table.remark"),
        field: "remark",
        enableRowGroup: false,
        suppressMenu: true,
        filter: false,
        sortable: false,
        rowGroup: false,
      },
    ];

    // ------------------end need setting manual for column table-----------------//
    this.context = { componentParent: this };
  }

  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.initialize();
  }

  initialize() {
    this.resetForm();
    this.getDropdowns();
    this.getBusinessSource();
    this.getPackages(this.form.businessSourceCode);
  }

  async resetForm() {
    this.isSaving = false;
    this.formPackageElement.resetForm();
    await this.$nextTick();
    this.packageList = [];
    this.form = {
      packageCode: "",
      adult: 1,
      child: 0,
      amount: 0,
      totalAmount: 0,
      quantity: 1,
      subFolioGroupCode: "A",
      accountCode: "",
      businessSourceCode: "",
    };
  }

  onFileChanged($event: any) {
    const target = $event.target as HTMLInputElement;
    if (target && target.files) {
      this.form.image = target.files[0];
    }
  }

  getTotalAmount() {
    // this.form.totalAmount = parseFloat(pax) * parseFloat(this.form.amount);
    this.form.quantity = this.form.endMeter - this.form.startMeter;
    this.form.totalAmount = this.form.quantity * this.form.amount;
  }

  getPackageDetails(packageCode: string) {
    for (const i of this.options.packages) {
      if (i.code == packageCode) {
        this.form.per_pax = i.per_pax;
        this.form.include_child = i.include_child;
        this.form.amount = i.amount;
        this.form.quantity = i.quantity;
        this.form.minQuantity = i.quantity;
        this.getTotalAmount();
      }
    }
  }

  onSave() {
    this.isSaving = true;
    const selectedRowData = this.getRowData();
    if (selectedRowData.length > 0) {
      this.form.remark = selectedRowData[0].remark ?? "";
    }
    this.$emit("save", this.form);
  }

  onSubmit() {
    this.formPackageElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onGridReady() {
    //
  }

  onChangeAmount() {
    this.getTotalAmount();
  }

  onChangeAdult() {
    this.getTotalAmount();
  }

  async onChangeBusinessSource(event: any) {
    this.hasBnsSource = !!event.target.value;
    const businessSourceCode = event.target.value;
    if (this.formType != $global.formType.banquetInProgress)
      this.getPackages(businessSourceCode);
    await this.loadPackageList();
    if (this.form.packageCode) {
      await this.getAccountDropdownList(
        this.form.packageCode,
        event.target.value
      );
    }
  }

  async onChangePackage(event: any) {
    const packageCode = event.target.value;
    if (!packageCode) return;
    this.getPackageBreakdowns(packageCode);
    this.getBusinessSourceCommission();
    this.getPackageDetails(packageCode);
    await this.$nextTick();
    this.getRoomUtilityMeter(packageCode);
  }

  async onChangeBanPackage(ev: any) {
    if (this.form.package_code) {
      const selectedPackage = this.packageList.find(
        (param: any) => param.code == ev.target.value
      );
      this.form.totalAmount = anyToFloat(selectedPackage.amount);
      this.insertDataGrid(selectedPackage);
    } else {
      this.handleDeleteRowData();
    }
    if (this.form.businessSourceCode) {
      await this.getAccountDropdownList(
        ev.target.value,
        this.form.businessSourceCode
      );
    }
  }

  async getAccountDropdownList(packageCode: string, bnsSCode: string) {
    await this.loadAccountList(packageCode, bnsSCode);
  }

  getRowNodeId(params: any) {
    return params.name;
  }

  getRowData() {
    let rowData: any = [];
    this.gridApi.forEachNode((node: any) => rowData.push(node.data));

    this.rowData = rowData;
    return rowData;
  }

  insertDataGrid(params: any) {
    let data = {
      name: params.name,
      quantity: params.quantity,
      amount: params.amount,
      remark: params.remark,
    };
    // const rowData = this.getRowData()
    // if (rowData.length > 0) {
    //   this.gridApi.applyTransaction({
    //     update: [data],
    //   });
    //   return;
    // }

    // this.gridApi.applyTransaction({
    //   add: [data],
    // });
    this.rowData = [data];
  }

  handleDeleteRowData() {
    this.gridApi.applyTransaction({
      remove: this.rowData,
    });
  }

  onChangeReservation() {
    const selectedRes = this.comboList.Reservation.find(
      (el: any) => el.Number == this.form.reservation_number
    );
    this.form.venue_code = selectedRes.VenueCode;
  }

  // API REQUEST======================================================================
  async getDropdowns() {
    try {
      const params = ["CommissionType", "Account", "Utility"];
      const { data } = await transactionAPI.codeNameListArray(params);
      this.options.commissionTypes = data.CommissionType;
      this.options.accounts = data.Account;
    } catch (err) {
      getError(err);
    }
  }

  async getBusinessSource() {
    try {
      const { data } = await transactionAPI.getAPCompanies();
      this.options.businessSources = data;
    } catch (err) {
      getError(err);
    }
  }

  async getBusinessSourceCommission() {
    const params = {
      PackageCode: this.form.packageCode,
      CompanyCode: this.form.businessSourceCode,
    };
    try {
      const { data } =
        await transactionAPI.getPackageByBusinessSourceCommission(params);
      this.form.commissionValue = data.commission_value;
      this.form.commissionTypeCode = data.commission_type_code;
      this.form.accountCode = data.account_code;
    } catch (err) {
      getError(err);
    }
  }

  async getPackages(businessSourceCode: string) {
    try {
      const params = {
        BusinessSourceCode: businessSourceCode,
        IsUtility: true,
      };
      const { data } = await transactionAPI.getPackageByBusinessSource(params);
      this.options.packages = data;
    } catch (err) {
      getError(err);
    }
  }

  async loadPackageList(bnsSCode: any = this.form.businessSourceCode) {
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
    companyCode: any = this.form.businessSourceCode
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
      this.form.accountCode = data.account_code;
    } catch (error) {
      getError(error);
    }
  }

  async getPackageBreakdowns(packageCode: string) {
    try {
      const { data } = await transactionAPI.getPackageBreakdown(packageCode);
      this.rowData = data;
    } catch (err) {
      getError(err);
    }
  }

  async getRoomUtilityMeter(PackageCode: string) {
    this.form.old = 0;
    try {
      const params = {
        RoomNumber: this.roomNumber,
        PackageCode: PackageCode,
      };
      const { data } = await transactionAPI.getRoomUtilityMeter(params);
      if (data) {
        this.form.startMeter = data;
      }
    } catch (error) {
      getError(error);
    }
  }

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

  // END API REQUEST==================================================================

  get subFolioGroup() {
    return "A";
  }

  // get gaWater() {
  //   return this.config.water;
  // }

  // get gaElectricity() {
  //   return this.config.electricity;
  // }

  get schema() {
    return Yup.object().shape({
      utility: Yup.string().required(),
      startMeter: Yup.number()
        .required()
        .positive()
        // .integer()
        .test((val) => val > 0),
      endMeter: Yup.number()
        .required()
        .positive()
        // .integer()
        .test((val) => val > this.form.startMeter),
      quantity: Yup.number()
        .required()
        .positive()
        // .integer()
        .test((val) => val > 0),
      totalAmount: Yup.number()
        .required()
        .positive()
        .test((val) => val > 0),
    });
  }
}
