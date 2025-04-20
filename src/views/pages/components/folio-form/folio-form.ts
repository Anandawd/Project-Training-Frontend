import { Options, Vue } from "vue-class-component";
import { useForm } from "vee-validate";
import * as Yup from "yup";
import {
  formatDateDatabase,
  formatDateTimeUTC,
  formatDateTimeZone,
  formatTimeValue,
} from "@/utils/format";

import $global from "@/utils/global";
import {
  getServerDateTime,
  getError,
  cloneObject,
  anyToFloat,
} from "@/utils/general";
import configStore from "@/stores/config";

import CSelect from "@/components/select/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";

// API
import { ref } from "vue";
import { focusOnInvalid } from "@/utils/validation";
import MasterDeskFolioAPI from "@/services/api/hotel/master-desk-folio/master-desk-folio";
import { getToastSuccess } from "@/utils/toast";
const masterDeskFolioAPI = new MasterDeskFolioAPI();

@Options({
  components: {
    CSelect,
    CDatepicker,
    CInput,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    editForm: {
      type: Object,
      require: true,
    },
    folioType: {
      type: String,
    },
    disabledEditData: Boolean,
  },
})
export default class FolioForm extends Vue {
  //select list
  public editForm: any = {};
  public folioType: string;
  public genders: Array<any> = [
    { code: "1", name: "Male" },
    { code: "0", name: "Female" },
  ];
  public modeDataValue: number = 1;
  public date: any = ref("11-10-2020");
  public showTimePanel: any = ref(false);
  public config = configStore();
  public formValidate = useForm();
  // Validation Schema
  validate: any = null;
  //helper
  public tempNights: any = ref("1");
  public formTitle: string = "";
  public modeData: number;
  public isSaving: boolean = false;

  public optionsList: any = {
    BookingSource: [],
    BusinessSource: [],
    CardType: [],
    CommissionType: [],
    Company: [],
    Country: [],
    Currency: [],
    GuestGroup: [],
    GuestType: [],
    Market: [],
    Member: [],
    Nationality: [],
    PaymentType: [],
    PurposeOf: [],
    RoomType: [],
    Sales: [],
    Title: [],
    RoomNumber: [
      // { RoomNumber: '101'}
    ],
  };

  //form object
  public form: any = {};
  serverDateTime: any;
  disabledEditData: any;
  dateTimeArrival: string;

  public async onSubmit() {
    const formData = cloneObject(this.form);
    formData.arrival = formatDateTimeUTC(this.form.arrival);
    formData.departure = formatDateTimeUTC(this.form.departure);
    formData.birth_date = formatDateTimeUTC(this.form.birth_date);
    formData.exchange_rate = anyToFloat(this.form.exchange_rate);
    this.isSaving = true;
    if (this.modeData == $global.modeData.edit) {
      await this.updateFolio(formData);
    } else {
      await this.insertFolio(formData);
    }
    this.isSaving = false;
  }

  onInvalidSubmit(values: any) {
    focusOnInvalid();
  }

  public async resetForm() {
    this.validate.resetForm();
    await this.getServerDateTime(); // load server date time for arrival date
    // await this.$nextTick();
    this.form = {
      arrival: this.dateTimeArrival,
      night: 1,
      departure: this.dateTimeDeparture,
      full_name: "",
      payment_type_code: this.optionsList.PaymentType ? this.dvPaymentType : "",
      market_code: this.optionsList.Market ? this.dvMarket : "",
      currency_code: this.optionsList.Market ? this.defaultCurrency : "",
      exchange_rate: 1,
      title_code: "",
      birth_date: "",
      number: 0,
    };
  }

  toggleTimePanelDatePicker() {
    this.showTimePanel = !this.showTimePanel;
  }

  addZeroHour(i: any) {
    let a = i;
    if (a < 10) {
      a = `0${a}`;
    }
    return a;
  }

  public getTotalNights() {
    const date1 = new Date(formatDateDatabase(this.form.arrival)).getTime();
    const date2 = new Date(formatDateDatabase(this.form.departure)).getTime();
    const auditDate = new Date(this.auditDate).getTime();
    if (date1 >= date2) {
      this.form.departure = this.dateTimeDepartureFromArrival;
    }
    if (date1 < auditDate && this.modeDataValue === $global.modeData.insert) {
      this.form.arrival = this.dateTimeArrival;
    }
    const date3 = new Date(formatDateDatabase(this.form.arrival));
    const date4 = new Date(formatDateDatabase(this.form.departure));

    // To calculate the time difference of two dates
    const diffInTime = date4.getTime() - date3.getTime();

    // To calculate the no. of days between two dates
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    // restrict negatif departure
    this.form.night = diffInDays;
    if (this.form.night > 0) {
      this.tempNights = this.form.night;
    }
  }

  getDepartureDate() {
    const arrivalDate = new Date(this.form.arrival);
    const date = arrivalDate.getDate() + this.form.night;
    const timeDeparture = formatTimeValue(this.form.departure);
    arrivalDate.setDate(date);
    const departureDate = formatDateDatabase(arrivalDate);
    this.form.departure = formatDateTimeZone(
      `${departureDate} ${timeDeparture}`
    );
  }

  getArrivalDate() {
    if (this.form.arrival < this.form.departure) return;
    const departureDate = new Date(this.form.departure);
    const date = departureDate.getDate() - this.form.night;
    const timeArrival = formatTimeValue(this.form.arrival);
    departureDate.setDate(date);
    const arrivalDate = formatDateDatabase(departureDate);
    this.form.arrival = formatDateTimeZone(`${arrivalDate} ${timeArrival}`);
  }

  public onSave() {
    if (this.disabledEditData) return;
    this.validate.$el.requestSubmit();
  }

  //DOM Handler
  onChangeNight() {
    if (this.form.night > 0) {
      this.tempNights = this.form.night;
      const departure = new Date(this.form.arrival);
      const timeDeparture = formatTimeValue(this.form.departure);
      const arrivalDate = new Date(this.form.arrival).getDate();
      const departureDate =
        parseInt(arrivalDate.toString()) + parseInt(this.form.night.toString());
      departure.setDate(departureDate);
      const dateDeparture = formatDateDatabase(departure);
      if (dateDeparture >= this.auditDate) {
        this.form.departure = formatDateTimeZone(
          `${dateDeparture} ${timeDeparture}`
        );
      } else {
        this.getTotalNights();
      }
    } else {
      this.form.night = this.tempNights;
    }
  }

  onChangeCountry($event: any) {
    this.getStateList($event.target.value);
  }

  onChangeState($event: any) {
    this.getCityList($event.target.value);
  }

  onChangeCity() {
    if (this.form.city_code) {
      this.form.city = "";
    }
  }

  onChangeArrival(): void {
    this.getDepartureDate();
  }

  onChangeCurrencyCode(event: any) {
    this.getExchangeRateCurrency(event.target.value);
  }

  onChangeDeparture(): void {
    this.getArrivalDate();
    this.getTotalNights();
  }

  onResetDate() {
    this.form.arrival = this.dateTimeArrival;
    this.form.departure = this.dateTimeDeparture;
    this.form.night = 1;
  }

  async onEdit(folioNumber: any) {
    this.formTitle = `${this.$t("folio.title.editFolio")}: #${
      this.form.folio_number
    }`;

    await this.getFolio(folioNumber);

    this.populateComboList();
    this.form.arrival = formatDateTimeZone(this.form.arrival);
    this.form.departure = formatDateTimeZone(this.form.departure);
    this.form.birth_date = formatDateTimeZone(this.form.birth_date);
    this.getTotalNights();
    this.getExchangeRateCurrency(this.form.currency_code);
  }

  async populateComboList() {
    await Promise.all([
      this.getStateList(this.form.country_code),
      this.getCityList(this.form.state_code),
    ]);
  }

  // API Request=================================================================================
  public async getComboList(): Promise<void> {
    try {
      const { data } = await masterDeskFolioAPI.codeNameListArray([
        "GuestTitle",
        "Currency",
        "Country",
        "PaymentType",
        "Company",
        "IDCardType",
        "Market",
        "BookingSource",
        "GuestGroup",
        "GuestType",
        "IDCardType",
        "Nationality",
        "Sales",
      ]);
      this.optionsList = data;
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getExchangeRateCurrency(currencyCode: any) {
    try {
      if (!currencyCode) return;
      const { data } = await masterDeskFolioAPI.detailData(
        "Currency",
        currencyCode
      );
      if (data) {
        this.form.exchange_rate = Number(data.data.exchange_rate);
      }
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getStateList(countryCode: any) {
    try {
      if (!countryCode) return;
      const { data } = await masterDeskFolioAPI.getStateByCountry(countryCode);
      this.optionsList.State = data;
      this.optionsList.City = [];
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getCityList(stateCode: any) {
    try {
      if (!stateCode) return;
      const { data } = await masterDeskFolioAPI.getCityByState(stateCode);
      this.optionsList.City = data;
    } catch (error: any) {
      throw getError(error);
    }
  }

  async insertFolio(formData: object) {
    try {
      const params = {
        ...formData,
        folio_type: this.folioType
          ? this.folioType
          : this.$route.meta.folioType.toString() == "MasterFolio"
          ? "1"
          : "2",
      };
      const { data } = await masterDeskFolioAPI.insertMasterDeskFolio(params);
      this.$emit("save");
      this.$emit("close");
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async updateFolio(formData: object) {
    const params = {
      ...formData,
      folio_type: this.folioType
        ? this.folioType
        : this.$route.meta.folioType.toString() == "MasterFolio"
        ? "1"
        : "2",
    };
    try {
      const { data } = await masterDeskFolioAPI.updateMasterDeskFolio(params);
      this.$emit("save");
      this.$emit("close");
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
  }

  async getFolio(folioNumber: any) {
    try {
      const { data } = await masterDeskFolioAPI.getMasterDeskFolio(folioNumber);
      this.form = data;
    } catch (error) {
      getError(error);
    }
  }
  // API REQUEST END=================================================================================
  public todayDateDisabled(date: any) {
    const audit = new Date(this.auditDate);
    audit.setDate(audit.getDate() - 1);
    return date < audit;
  }

  public async mounted() {
    // LOAD API
    await this.getComboList();
    if (this.modeData !== $global.modeData.insert) {
      if (this.editForm) {
        this.form = this.editForm;
        this.populateComboList();
        this.form.arrival = formatDateTimeZone(this.editForm.arrival);
        this.form.departure = formatDateTimeZone(this.editForm.departure);
        this.form.birth_date = formatDateTimeZone(this.editForm.birth_date);
        this.getTotalNights();
        this.getExchangeRateCurrency(this.form.currency_code);
      }
    } else {
      await this.resetForm();
    }
  }

  get dateTimeDeparture() {
    const arrival = formatDateDatabase(this.auditDate);
    const departure = new Date(formatDateTimeZone(`${arrival}`));
    departure.setDate(departure.getDate() + 1);

    return formatDateTimeZone(departure);
  }

  dateDisabledDeparture(date: any) {
    const audit = new Date(this.auditDate);
    return date < audit;
  }

  async getServerDateTime() {
    this.config.getAuditDate();
    this.serverDateTime = await getServerDateTime();
    this.setDateTimeArrival();
  }

  setDateTimeArrival() {
    const time = formatTimeValue(this.serverDateTime);
    const arrResv = formatDateTimeZone(`${this.auditDate} ${time}`);
    this.dateTimeArrival = arrResv;
  }

  get dateTimeDepartureFromArrival() {
    const arrival = formatDateDatabase(this.form.arrival);
    const departure = new Date(formatDateTimeZone(`${arrival}`));
    departure.setDate(departure.getDate() + 1);
    return formatDateTimeZone(departure);
  }

  get auditDate() {
    return this.config.auditDate;
  }
  // INPUT FIELD REQUIRED
  get isTitleRequired() {
    return this.config.isTitleRequired;
  }
  get isStateRequired() {
    return this.config.isStateRequired;
  }
  get isPhone1Required() {
    return this.config.isPhone1Required;
  }
  get isNationalityRequired() {
    return this.config.isNationalityRequired;
  }
  get isMarketRequired() {
    return this.config.isMarketRequired;
  }
  get isEmailRequired() {
    return this.config.isEmailRequired;
  }
  get isCompanyRequired() {
    return this.config.isCompanyRequired;
  }
  get isCityRequired() {
    return this.config.isCityRequired;
  }
  // DEFAULT VARIABLE
  get dvPaymentType() {
    return this.config.dvPaymentType;
  }
  get dvMarket() {
    return this.config.dvMarket;
  }
  // GLOBAL ACCOUNT
  get defaultCurrency() {
    return this.config.defaultCurrency;
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      Title: this.isTitleRequired ? Yup.string().required() : null,
      "Full Name": Yup.string().required(),
      "Arrival date": Yup.string().required(),
      "Departure date": Yup.string().required(),
      PaymentType: Yup.string().required(),
      State: this.isStateRequired ? Yup.string().required() : null,
      "Phone 1": this.isPhone1Required ? Yup.string().required() : null,
      Nationality: this.isNationalityRequired ? Yup.string().required() : null,
      Market: this.isMarketRequired ? Yup.string().required() : null,
      Email: this.isEmailRequired ? Yup.string().required() : null,
      Company: this.isCompanyRequired ? Yup.string().required() : null,
      City: this.isCityRequired ? Yup.string().required() : null,
    });
  }
}
