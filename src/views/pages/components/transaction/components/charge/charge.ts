import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import { Form } from "vee-validate";

import configStore from "@/stores/config";
import $global from "@/utils/global";
import { AgGridVue } from "ag-grid-vue3";
import TransactionAPI from "@/services/api/transaction";
import { reactive, ref } from "vue";
import { getError } from "@/utils/general";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import * as Yup from "yup";
const transactionAPI = new TransactionAPI();

// Banquet
import CDatepicker from "@/components/datepicker/datepicker.vue";
import BookingApi from "@/services/api/banquet/booking";
import { formatDateDatabase } from "@/utils/format";
const bookingApi = new BookingApi();

@Options({
  components: {
    CSelect,
    CInput,
    AgGridVue,
    CCheckbox,
    // banquet
    CDatepicker,
  },
  props: {
    transactionType: [String, Number],
    folioNumber: {
      require: true,
      type: Number,
    },
    bookingNumber: {
      require: true,
      type: Number,
    },
    balance: {
      type: Number,
    },
    formType: {
      type: String,
      require: false,
    },
  },
  emits: ["close", "save"],
})
export default class ChargeForm extends Vue {
  public config = configStore();
  public form: any = {};
  public folioNumber: number;
  public transactionType: any;
  public options: any = reactive({
    currencies: [{ Code: "IDR", Name: "Rupiah" }],
    subDepartments: [],
    accounts: [],
    cardType: [],
    subFolioGroup: [
      { code: "A", name: "Sub Folio A" },
      { code: "B", name: "Sub Folio B" },
      { code: "C", name: "Sub Folio C" },
      { code: "D", name: "Sub Folio D" },
    ],
  });
  isSaving: boolean = false;
  public folioTransfer: any = ref("");
  formElement: any = ref(null);
  balance: number;
  // Banquet
  comboList: any = [];
  productList: any = [];
  FormType: any;
  bookingNumber: number = 0;
  ColumnProductOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "100",
    },
    {
      label: "price",
      field: "price",
      align: "right",
      width: "150",
      format: "number",
    },
  ];
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
  // GENERAL FUNCTION ================================================================
  getTotalAmount() {
    this.form.amount = this.form.amountForeign * this.form.exchangeRate;
  }

  async resetForm() {
    this.isSaving = false;
    this.formElement.resetForm();
    await this.$nextTick();
    this.form = {
      subDepartmentCode: "",
      currencyCode: this.defaultCurrency,
      subFolioGroupCode: "A",
      automaticTransfer: 1,
      postingBreakdown: 0,
      exchangeRate: 1,
      accountCode: "",
      amount: 0,
      amountForeign:
        this.balance < 0 &&
        this.transactionType == $global.modeTransaction.apTransaction
          ? -this.balance
          : 0,
      remark: "",
      companyCode: "",
      documentNumber: "",
      modeEditor: this.modeEditor,
    };

    if (
      this.options.subDepartments.find(
        (val: any) => val.code == this.sdFrontOffice
      )
    ) {
      this.form.subDepartmentCode = this.sdFrontOffice;
    }
    setInputFocus();
  }

  async initialize() {
    await this.getDropdowns();
    await this.resetForm();
    if (this.transactionType === $global.modeTransaction.apTransaction)
      this.getAPCompanies();
    this.getAccounts(this.form.subDepartmentCode);
    this.getTotalAmount();

    // banquet
    await this.loadProductComboList();
    await this.loadProductList();
    this.form.is_posting = 1;
  }

  // banquet
  onChangeReservation() {
    const selectedRes = this.comboList.Reservation.find(
      (el: any) => el.Number == this.form.reservation_number
    );
    this.form.served_date = selectedRes.Date;
    this.form.start_time = selectedRes["Start Time"] + this.getTimezoneOffset();
    this.form.end_time = selectedRes["End Time"] + this.getTimezoneOffset();
    this.form.venue_code = selectedRes.VenueCode;
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

  onChangeDiscountPercent() {
    this.form.discount = 0;
  }

  onChangePrice() {
    this.form.sub_total = this.form.quantity * this.form.price;
    this.form.amount = this.form.quantity * this.form.price;
  }

  onChangeDiscount() {
    const discount = this.form.discount_percent
      ? (this.form.discount * this.form.sub_total) / 100
      : this.form.discount;
    this.form.amount = this.form.sub_total - discount;
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

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onSave() {
    this.isSaving = true;
    if (this.formType == $global.formType.banquetInProgress) {
      console.log("iyessss");

      this.form.served_date = formatDateDatabase(this.form.served_date);
    }
    this.$emit("save", this.form);
  }

  onSubmit() {
    this.formElement.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangeAmount() {
    this.getTotalAmount();
  }

  onChangeAccount(event: any) {
    const accountCode = event.target.value;
    this.isFolioAutoTransferAccount(accountCode);
  }

  async onChangeCurrency(event: any) {
    await this.getExchangeRate(event.target.value);
    this.getTotalAmount();
  }

  onChangeSubDepartment(event: any) {
    const subDepartmentCode = event.target.value;
    this.getAccounts(subDepartmentCode);
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async getDropdowns() {
    try {
      const params = ["SubDepartment", "Currency"];
      const { data } = await transactionAPI.codeNameListArray(params);
      this.options.subDepartments = data.SubDepartment;
      this.options.currencies = data.Currency;
    } catch (err) {
      getError(err);
    }
  }

  async getAccounts(subDepartmentCode: string) {
    try {
      const params = {
        ModeEditor: this.modeEditor,
        CurrencyCode: this.form.currencyCode,
        SubDepartmentCode: subDepartmentCode,
      };
      const { data } = await transactionAPI.getAccount(params);
      this.options.accounts = data;
    } catch (err) {
      getError(err);
    }
  }

  async getAPCompanies() {
    try {
      const { data } = await transactionAPI.getAPCompanies();
      this.options.companies = data;
    } catch (err) {
      getError(err);
    }
  }

  async getExchangeRate(currencyCode: string) {
    try {
      const { data } = await transactionAPI.detailData(
        "Currency",
        currencyCode
      );
      this.form.exchangeRate = data.exchange_rate;
    } catch (err) {
      getError(err);
    }
  }

  async isFolioAutoTransferAccount(accountCode: string) {
    this.folioTransfer = false;
    if (!accountCode) {
      return;
    }
    try {
      const { data } = await transactionAPI.isFolioAutoTransferAccount(
        this.folioNumber,
        accountCode
      );
      this.folioTransfer = data.folio_transfer;
    } catch (err) {
      getError(err);
    }
  }

  // Banquet
  async loadProductComboList() {
    try {
      const { data } = await bookingApi.bookingReservationProductComboList(
        this.bookingNumber
      );
      console.log(data, "loadProductComboList");

      this.comboList = data;
    } catch (error) {
      getError(error);
    }
  }

  async loadProductList(categoryCode: any = this.form.category_code) {
    try {
      let param = {
        category_code: categoryCode,
      };
      const { data } = await bookingApi.bookingReservationProductList(param);
      this.productList = data;
    } catch (error) {
      getError(error);
    }
  }

  // END API REQUEST==================================================================
  mounted(): void {
    this.initialize();
  }

  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
  get defaultCurrency() {
    return this.config.defaultCurrency;
  }
  get subFolioGroup() {
    return "A";
  }
  get accountRoomCharge() {
    return this.config.roomCharge;
  }

  get modeEditor() {
    if (this.transactionType === $global.modeTransaction.charge) {
      return 0;
    } else if (this.transactionType === $global.modeTransaction.apTransaction) {
      return 10;
    }
  }

  get schema() {
    return Yup.object().shape({
      subFolioGroup: Yup.string().required(),
      currency: Yup.string().required(),
      excRate: Yup.string().required(),
      subDepartment: Yup.string().required(),
      account: Yup.string().required(),
      company:
        this.transactionType === $global.modeTransaction.apTransaction
          ? Yup.string().required()
          : null,
      amountForeign: Yup.number()
        .required()
        .positive()
        .test((val) => val > 0),
    });
  }

  get banquetSchema() {
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
}
