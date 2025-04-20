import { Options, Vue } from "vue-class-component";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CSelect from "@/components/select/select.vue";
import CRadio from "@/components/radio/radio.vue";
import CInput from "@/components/input/input.vue";
import { BTabs, BTab } from "bootstrap-vue-3";
import { reactive, ref } from "vue";
import BookingApi from "@/services/api/banquet/booking";
import {
  formatDateDatabase,
  formatDateTimeUTC,
  formatDateTimeZone,
  formatTimeValue,
} from "@/utils/format";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { anyToFloat, getError, getServerDateTime } from "@/utils/general";
import ConfigStore from "@/stores/config";
import * as Yup from "yup";
const configStore = ConfigStore();
const bookingApi = new BookingApi();

@Options({
  components: {
    BTabs,
    BTab,
    CDatepicker,
    CSelect,
    CRadio,
    CInput,
    CCheckbox,
  },
  props: {
    formType: {
      type: String,
      require: true,
    },
    isSaving: {
      type: Boolean,
      require: true,
    },
    isSaved: {
      type: Boolean,
      require: true,
      default: false,
    },
    modeData: {
      type: Number,
    },
    isUpdateResBV: {
      type: Boolean,
      require: true,
      default: false,
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["isGroupCheckIn", "checkIn", "refreshData"],
})
export default class BookingInfoForm extends Vue {
  // public auth = authModule();
  public showForm = false;
  // public modeData: any = ref();
  public form: any = reactive({
    booking_number: 0,
    is_inside: "",
    booking_data: {},
    guest_detail_data: {},
    contact_person_data: {},
  });
  // public form: any = reactive({})
  public isSaving: boolean = false;
  bookInformationValidation: any = ref();
  comboList: any = [];
  companyList: any = [];
  serverDateTime: Promise<any>;
  modeData: number;
  isSaved: boolean;
  stateList: any = [];
  disabledCity: boolean = true;
  cityList: any = [];
  isUpdateResBV: boolean;
  formType: string;
  banquetArrivalDate: any;
  focus: boolean;

  async initialize(formData?: any) {
    let loader = this.$loading.show();
    await this.$nextTick(() => {
      if (this.formType == this.$global.formType.banquetView) {
        this.banquetArrivalDate = formData.arrivalDate;
      }
      this.resetForm();
    });

    await this.loadDropdown();
    await this.loadCompanyDropdown();
    if (formData && this.formType != this.$global.formType.banquetView) {
      if (formData.ContactPersonData.country_code) {
        await this.onChangeCountry(
          null,
          formData.ContactPersonData.country_code
        );
      }
      if (formData.ContactPersonData.state_code) {
        await this.onChangeState(null, formData.ContactPersonData.state_code);
      }
      if (formData.ContactPersonData.city_code) {
        await this.onChangeCity(null, formData.ContactPersonData.city_code);
      }
      this.setDataForm(formData);
      // GuestDetailData.arrival_res
    }

    loader.hide();
    setInputFocus();
  }

  setArrivalDate(date: string) {
    const time = formatTimeValue(this.serverDateTime);
    date = date;
    const arrResv = formatDateTimeZone(`${formatDateDatabase(date)} ${time}`);
    return arrResv;
  }

  setDepartureDate(date: string) {
    const arrival = formatDateDatabase(date);
    const departure = new Date(
      formatDateTimeZone(`${arrival} ${this.checkOutLimit}`)
    );

    return formatDateTimeZone(departure);
  }

  onResetDate() {
    this.form.guest_detail_data.arrival = this.dateTimeArrival;
    this.form.guest_detail_data.departure = this.dateTimeDeparture;
  }

  async resetForm() {
    this.bookInformationValidation.resetForm();
    await this.getServerDateTime();

    await this.$nextTick(() => {
      this.form.guest_detail_data.arrival = this.banquetArrivalDate
        ? this.setArrivalDate(this.banquetArrivalDate)
        : this.dateTimeArrival;
      this.form.guest_detail_data.departure = this.banquetArrivalDate
        ? this.setDepartureDate(this.banquetArrivalDate)
        : this.dateTimeDeparture;
      this.stateList = [];
      this.cityList = [];
      this.form.is_inside = 1;
      this.form.booking_data.show_notes = 0;
      this.form.booking_data.is_public = 1;
      this.form.guest_detail_data.adult = 1;
      this.form.guest_detail_data.currency_code = "IDR";
      this.onChangeCurrency();
      this.form.guest_detail_data.is_constant_currency = 0;
      this.form.booking_data.estimate_revenue = 0;
      this.form.guest_detail_data.commission_value = 0;
      this.form.guest_detail_data.is_constant_currency = 1;
    });
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onSave() {
    this.form.guest_detail_data.child = this.form.guest_detail_data.child ?? 0;
    this.form.guest_detail_data.business_source_code =
      this.form.guest_detail_data.business_source_code ?? "";
    this.form.guest_detail_data.commission_type_code =
      this.form.guest_detail_data.commission_type_code ?? "";
    this.form.guest_detail_data.commission_value =
      this.form.guest_detail_data.commission_value ?? 0;
    this.form.guest_detail_data.booking_source_code =
      this.form.guest_detail_data.booking_source_code ?? "";
    this.form.contact_person_data.country_code =
      this.form.contact_person_data.country_code ?? "";
    this.form.guest_detail_data.market_code =
      this.form.guest_detail_data.market_code ?? "";
    this.form.contact_person_data.state_code =
      this.form.contact_person_data.state_code ?? "";
    this.form.contact_person_data.city_code =
      this.form.contact_person_data.city_code ?? "";
    this.form.contact_person_data.company_code =
      this.form.contact_person_data.company_code ?? "";
    this.form.booking_data.group_code = this.form.booking_data.group_code ?? "";
    this.form.booking_data.marketing_code =
      this.form.booking_data.marketing_code ?? "";
    this.form.booking_data.reservation_type =
      this.form.booking_data.reservation_type ?? "";
    this.form.booking_data.booking_number =
      this.form.booking_data.booking_number ?? 0;
    this.form.booking_data.folio_transfer =
      this.form.booking_data.folio_transfer ?? 0;
    this.form.booking_data.estimate_revenue =
      this.form.booking_data.estimate_revenue ?? 0;
    this.form.guest_detail_data.bill_instruction =
      this.form.guest_detail_data.bill_instruction ?? "";
    // TODO: ini tambahan karena bv save yg versi _res
    if (this.isUpdateResBV) {
      delete this.form.guest_detail_data.arrival_res;
      delete this.form.guest_detail_data.departure_res;
    }

    this.$emit("save", this.form);
  }

  onChangeCountry(event?: any, countryCode?: string) {
    if (event?.target.value || countryCode) {
      this.getStateList(countryCode ?? event.target.value);
    }
  }

  async onChangeState(event?: any, stateCode?: string) {
    if (this.form.contact_person_data.state_code || stateCode) {
      await this.getCityList(
        stateCode ?? this.form.contact_person_data.state_code
      );
    } else {
      this.cityList = [];
      this.form.contact_person_data.city_code = "";
      this.disabledCity = this.form.contact_person_data.city_code == "";
    }
  }

  onChangeCity(event?: any, cityCode?: any) {
    if (cityCode || this.form.contact_person_data.city_code) {
      const city = cityCode ? cityCode : event.target.value;
      this.disabledCity = city != this.$global.constCityOtherCode;
      this.form.contact_person_data.city = "";
    }
  }

  onChangeCityInput() {
    if (
      this.form.contact_person_data.city_code != this.$global.constCityOtherCode
    ) {
      this.form.contact_person_data.city_code = "";
    }
  }

  repeatLoadDropdownList(isState: boolean) {
    if (this.form.contact_person_data.country_code) {
      if (isState) {
        this.getStateList(this.form.contact_person_data.country_code);
      } else {
        if (this.form.contact_person_data.state_code)
          this.getCityList(this.form.contact_person_data.state_code);
      }
    }
  }

  onChangeCurrency() {
    this.getExchangeRateCurrency(this.form.guest_detail_data.currency_code);
  }

  setDataForm(formData: any) {
    this.form.booking_data = formData.BookingData;
    this.form.guest_detail_data = formData.GuestDetailData;

    if (this.isUpdateResBV) {
      // for banquet view
      this.form.guest_detail_data.arrival = formatDateTimeZone(
        formData.GuestDetailData.arrival_res
      );
      this.form.guest_detail_data.departure = formatDateTimeZone(
        formData.GuestDetailData.departure_res
      );
    } else {
      this.form.guest_detail_data.arrival = formatDateTimeZone(
        formData.GuestDetailData.arrival
      );
      this.form.guest_detail_data.departure = formatDateTimeZone(
        formData.GuestDetailData.departure
      );
    }
    this.form.contact_person_data = formData.ContactPersonData;
    this.form.is_inside = formData.is_inside;
    this.form.booking_number = formData.booking_number;
  }

  getDepartureDate() {
    if (
      this.form.guest_detail_data.arrival <
      this.form.guest_detail_data.departure
    )
      return;
    const arrivalDate = new Date(this.form.guest_detail_data.arrival);
    const timeDeparture = formatTimeValue(
      this.form.guest_detail_data.departure
    );
    const departureDate = formatDateDatabase(arrivalDate);
    this.form.guest_detail_data.departure = formatDateTimeZone(
      `${departureDate} ${timeDeparture}`
    );
  }

  onChangeArrival(): void {
    this.getDepartureDate();
  }

  getArrivalDate() {
    if (
      this.form.guest_detail_data.arrival <
      this.form.guest_detail_data.departure
    )
      return;
    const departureDate = new Date(this.form.guest_detail_data.departure);
    const timeArrival = formatTimeValue(this.form.guest_detail_data.arrival);
    const arrivalDate = formatDateDatabase(departureDate);
    this.form.guest_detail_data.arrival = formatDateTimeZone(
      `${arrivalDate} ${timeArrival}`
    );
  }

  onChangeDeparture(): void {
    this.getArrivalDate();
  }

  dateDisabledArrival(date: any) {
    let dateX = new Date(this.auditDate);
    let currentDate = dateX.getDate() - 1;
    dateX.setDate(currentDate);
    return date < dateX;
  }

  dateDisabledDeparture(date: any) {
    let dateX = new Date(this.auditDate);
    let currentDate = dateX.getDate() - 1;
    dateX.setDate(currentDate);
    return date < dateX;
  }
  // API REQUEST===========================================================
  async loadDropdown(param: string = "") {
    try {
      let params = [
        "Country",
        "Currency",
        "Market",
        "BookingSource",
        "BusinessSource",
        "CommissionType",
        "PaymentType",
        "GuestGroup",
        "Sales",
        "BanquetReservationType",
        "Theme",
        "Venue",
        "SeatingPlan",
      ];
      if (param) {
        params = [param];
      }
      const { data } = await bookingApi.codeNameListArray(params);
      if (param) {
        this.comboList[param] = data[param];
      } else {
        this.comboList = data;
      }
    } catch (error) {
      getError(error);
    }
  }

  async loadCompanyDropdown() {
    try {
      const { data } = await bookingApi.GetCompanyDetailList();
      this.companyList = data;
    } catch (error) {
      getError(error);
    }
  }

  async getStateList(countryCode: any) {
    try {
      const { data } = await bookingApi.StateByCountry(countryCode);
      this.stateList = data;
    } catch (error) {
      getError(error);
    }
  }

  async getCityList(stateCode: any) {
    try {
      const { data } = await bookingApi.CityByState(stateCode);
      this.cityList = data;
    } catch (error) {
      getError(error);
    }
  }

  public async getExchangeRateCurrency(currencyCode: any) {
    try {
      if (!currencyCode) return;
      const { data } = await bookingApi.detailData("Currency", currencyCode);
      if (data) {
        this.form.guest_detail_data.exchange_rate = anyToFloat(
          data.exchange_rate
        );
      }
    } catch (error: any) {
      throw getError(error);
    }
  }

  async getServerDateTime() {
    configStore.getAuditDate();
    this.serverDateTime = await getServerDateTime();
  }
  // END API ===========================================================

  // GETTER AND SETTER ===============================================================
  get dateTimeArrival() {
    const time = formatTimeValue(this.serverDateTime);
    const arrResv = formatDateTimeZone(`${this.auditDate} ${time}`);
    return arrResv;
  }

  get dateTimeDeparture() {
    const arrival = formatDateDatabase(this.auditDate);
    const departure = new Date(
      formatDateTimeZone(`${arrival} ${this.checkOutLimit}`)
    );

    return formatDateTimeZone(departure);
  }

  get checkOutLimit() {
    return configStore.checkOutLimit;
  }

  get auditDate() {
    return configStore.auditDate;
  }
  // END GETTER AND SETTER ===========================================================
  timeStringToDate(dateString: any) {
    if (dateString) {
      let date = new Date(dateString);
      let timeArr = dateString.split("T");
      let timeStr = timeArr[1].split("+")[0];
      let [hours, minutes, seconds] = timeStr.split(":");
      date.setHours(hours, minutes, seconds, 0);

      return date;
    }
  }

  get schema() {
    return Yup.object().shape({
      "Start Date": Yup.string().required(),
      // "End Date": Yup.string().required(),
      "End Date": Yup.string()
        .required()
        .test((val: any) => {
          return (
            this.timeStringToDate(val) >
            this.timeStringToDate(this.form.guest_detail_data.arrival)
          );
        }),
      currency: Yup.string().required(),
      "exch Rate": Yup.string().required(),
      venue: !this.isSaved ? Yup.string().required() : null,
      theme: !this.isSaved ? Yup.string().required() : null,
      seatingPlan: !this.isSaved ? Yup.string().required() : null,
      Adult: !this.isSaved ? Yup.number().required().min(1) : null,
      paymentType: Yup.string().required(),
      market: Yup.string().required(),
      eventName: Yup.string().required(),
      bookedBy: Yup.string().required(),
      company: Yup.string().required(),
      resType: Yup.string().required(),
    });
  }
}
