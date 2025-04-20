import { Options, Vue } from "vue-class-component";

import { Field, Form, useForm } from "vee-validate";
import * as Yup from "yup";
import {
  formatDateDatabase,
  formatDateTimeZone,
  formatDateTimeUTC,
  formatTimeValue,
  formatDate,
  formatDate3,
  formatNumberValue,
  formatDateTimeZeroUTC,
} from "@/utils/format";
import { useToast } from "vue-toastification";
import { BTabs, BTab } from "bootstrap-vue-3";

import $global from "@/utils/global";

import CSelect from "@/components/select/select.vue";
import RSelect from "@/components/select-room/select.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import CInput from "@/components/input/input.vue";
import Credential from "@/views/pages/components/credential/credential.vue";
import CModal from "@/components/modal/modal.vue";
import GuestProfile from "../../modules/hotel/guest-profile/guest-profile.vue";
// import CInput from './components/input/TextInput.vue';
// import Suggestion from "@/components/Autocomplete.vue";

// API
import RegistrationFormAPI from "@/services/api/hotel/registration-form/registration-form";
import TADAMemberAPI from "@/services/api/hotel/member/tada_member";
import GuestProfileAPI from "@/services/api/hotel/guest-profile/guest-profile";
import { nextTick, reactive, ref } from "vue";
import {
  anyToFloat,
  cloneObject,
  getError,
  getServerDateTime,
} from "@/utils/general";
import configStore from "@/stores/config";
import { focusOnInvalid } from "@/utils/validation";
import { getToastInfo, getToastSuccess } from "@/utils/toast";
const registrationFormAPI = new RegistrationFormAPI();
const tadaMemberAPI = new TADAMemberAPI();
const guestProfileAPI = new GuestProfileAPI();

@Options({
  components: {
    // Suggestion,
    CCheckbox,
    BTabs,
    BTab,
    Credential,
    CSelect,
    CModal,
    GuestProfile,
    RSelect,
    CDatepicker,
    CInput,
    "v-form": Form,
  },
  props: {
    formType: String,
    disabledEditData: Boolean,
    isFromAllotment: Boolean,
  },
  emits: ["save"],
})
export default class RegistrationForm extends Vue {
  public formatDate3 = formatDate3;
  public formatNumberValue = formatNumberValue;
  public tabIndex: any = 0;
  private config = configStore();
  public genders: Array<any> = [
    { code: 1, name: "Male" },
    { code: 0, name: "Female" },
  ];
  public modeDataValue: number = 1;
  public date: any = ref("11-10-2020");
  public showTimePanel: any = ref(false);
  public formValidate = useForm();
  public credentialTitle: string = "";
  // Validation Schema
  public validate = ref(null);
  //helper
  public tempNights: any = ref("1");
  public full_name: any = ref();
  public rateB4: any = reactive({});
  private toast = useToast();
  public showForm = false;
  public formTitle: string = "";
  public modeData: number;
  public availableRoomCount: number = 0;
  public editForm: any = {};
  public isFormResetted: boolean = false;
  public showGuestProfileDetail: boolean = false;
  public isFromAllotment: boolean = false;

  profile1: any = {};
  profile2: any = {};
  profile3: any = {};
  profile4: any = {};
  profile5: any = {};
  profile6: any = {};
  profile7: any = {};
  profile8: any = {};
  profile9: any = {};
  profile10: any = {};
  guestGeneralData: any = {};
  detail: any = {};
  form: any = {};
  balance: string | number = 0;
  folioNumber: number = 0;
  reservationNumber: number = 0;

  public optionsList: any = {
    BookingSource: [],
    BusinessSource: [],
    IDCardType: [],
    CommissionType: [],
    Company: [],
    Country: [],
    Currency: [],
    GuestGroup: [],
    GuestType: [],
    Market: [],
    RoomMember: [],
    Nationality: [],
    BedType: [],
    RoomRate: [],
    PaymentType: [],
    PurposeOf: [],
    RoomType: [],
    Sales: [],
    Title: [],
    RoomNumber: [],
  };

  // late list
  bedTypeList: Array<any> = [];
  roomNumberList: Array<any> = [];
  roomRateList: Array<any> = [];
  stateList: any = {};
  cityList: any = {};

  //form object
  public isReadyRoom: boolean = false;

  public weekendRate: number = 0;
  public weekdayRate: number = 0;

  clickCount: number = 0;
  formOld: any = {};
  guestGeneralDataOld: any = {};
  detailOld: any = {};
  profile1Old: any = {};
  profile2Old: any = {};
  profile3Old: any = {};
  profile4Old: any = {};
  profile5Old: any = {};
  profile6Old: any = {};
  profile7Old: any = {};
  profile8Old: any = {};
  profile9Old: any = {};
  profile10Old: any = {};
  serverDateTime: Promise<any>;
  isBusinessSource: boolean;
  isOverrideDiscountRate: boolean;
  isNewReservation: boolean;
  canProcessRoomTypeNRate: any;
  initialFormValues: {
    "Arrival date": string;
    "Departure date": string;
    "Payment Type": any;
    Market: any;
  };
  formType: string;
  credentialElement: any = null;
  // arrivalDate: string | Date;
  // departureDate: string | Date;
  columnRateOptions: any = [
    {
      label: "name",
      field: "name",
      width: "200",
    },
    {
      label: "weekday",
      field: "weekday_rate1",
      width: "100",
      align: "right",
      format: "number",
    },
    {
      label: "weekend",
      field: "weekend_rate1",
      width: "100",
      align: "right",
      format: "number",
    },
  ];
  showGuestProfile: boolean = false;
  loadEditData: boolean;
  registrationFormElement: Object | Function | HTMLElement = null;
  guestProfileNumber: number;
  originalBusinessSourceCommission: any = {};
  isSaving: boolean;
  guestProfileDetail: any = {};
  countGuestProfile: any = 0;
  guestProfileDetailList: any = [];
  guestProfileIndex: number = 0;
  isNewGuestProfileCreated: boolean = false;
  confirmationEl: any = null;

  async initialize(
    arrivalDate?: string,
    night?: number,
    roomNumber?: string,
    roomTypeCode?: string,
    isWalkIn?: boolean
  ) {
    await this.resetForm();
    if (
      this.$route.meta.formType.toString() ===
        this.$global.formType.roomAvailability ||
      this.$route.meta.formType.toString() === this.$global.formType.floorPlan
    ) {
      this.setArrivalDate(
        arrivalDate,
        night,
        roomNumber,
        roomTypeCode,
        isWalkIn
      );
    }
  }

  public async onSubmit(
    values: any,
    continuesCredential?: boolean,
    userId?: string
  ) {
    if (this.isSaving) return;
    this.isSaving = true;
    await this.getRoomCountAvailable();
    const auditDate = formatDateDatabase(this.auditDate);
    const arrivalDate = formatDateDatabase(this.detail.arrival);
    const departureDate = formatDateDatabase(this.detail.departure);
    this.detail.commission_value = anyToFloat(this.detail.commission_value);
    if (arrivalDate >= departureDate) {
      this.isSaving = false;
      return this.toast.error(this.$t("messages.reservationForm[2]"));
    } else if (
      arrivalDate < auditDate &&
      (this.formType == $global.formType.reservation ||
        this.modeData == $global.modeData.insert)
    ) {
      this.isSaving = false;
      return this.toast.error(this.$t("messages.reservationForm[4]"));
    } else if (
      departureDate <= auditDate &&
      (this.formType == $global.formType.reservation ||
        this.modeData == $global.modeData.insert)
    ) {
      this.isSaving = false;
      return this.toast.error(this.$t("messages.reservationForm[5]"));
    } else if (departureDate < auditDate) {
      this.isSaving = false;
      return this.toast.error(this.$t("messages.reservationForm[26]"));
    } else if (
      !this.detail.wait_list &&
      (this.modeData === $global.modeData.insert ||
        this.modeData === $global.modeData.duplicate) &&
      this.availableRoomCount <= 0
    ) {
      this.isSaving = false;
      return this.toast.error(this.$t("messages.reservationForm[6]"));
    } else {
      let isBusinessSource = false;
      let isOverrideDiscountRate = false;
      await this.getServerDateTime();
      if (
        this.detail.business_source_code ||
        this.detailOld.business_source_code
      ) {
        if (
          this.modeData == $global.modeData.insert ||
          this.modeData == $global.modeData.duplicate
        ) {
          if (
            this.detail.commission_type_code != "" ||
            this.detail.commission_value > 0
          ) {
            if (this.detail.room_rate_code != "") {
              await this.getBusinessSourceCommissionRate(true);
              if (
                this.originalBusinessSourceCommission.commission_type_code !=
                  this.detail.commission_type_code ||
                this.originalBusinessSourceCommission.commission_value !=
                  this.detail.commission_value
              ) {
                isBusinessSource = true;
              }
            }
          }
        } else if (this.modeData == $global.modeData.edit) {
          if (
            this.detail.business_source_code !==
              this.detailOld.business_source_code ||
            this.detail.commission_type_code !=
              this.detailOld.commission_type_code ||
            this.detail.commission_value > this.detailOld.commission_value
          ) {
            isBusinessSource = true;
          }
        }
      }

      // is override
      if (this.detail.room_rate_code || this.detailOld.room_rate_code) {
        if (
          this.modeData == $global.modeData.insert ||
          this.modeData == $global.modeData.duplicate
        ) {
          if (
            this.detail.discount > 0 ||
            this.detailOld.weekday_rate > this.detail.weekday_rate ||
            this.detailOld.weekend_rate > this.detail.weekend_rate
          ) {
            isOverrideDiscountRate = true;
          }
        } else if (
          this.modeData === $global.modeData.edit ||
          this.modeData === $global.modeData.checkIn
        ) {
          if (
            this.detailOld.weekday_rate > this.detail.weekday_rate ||
            this.detailOld.weekend_rate > this.detail.weekend_rate ||
            this.detailOld.discount < this.detail.discount ||
            (this.detailOld.discount_percent != this.detail.discount_percent &&
              this.detail.discount > 0)
          ) {
            isOverrideDiscountRate = true;
          }
        }
      }

      const isDecreaseStay =
        this.modeData === $global.modeData.edit &&
        formatDateDatabase(this.detail.departure) <
          formatDateDatabase(this.detailOld.departure);

      if (isBusinessSource || isOverrideDiscountRate || isDecreaseStay) {
        if (!continuesCredential) {
          if (isBusinessSource) {
            if (isOverrideDiscountRate) {
              if (isDecreaseStay) {
                this.isSaving = false;
                return this.showCredential(
                  this.$t(
                    "credential.title.businessSourceOverrideAndDecreaseStay"
                  ),
                  [
                    $global.frontDeskAccessOrder.accessSpecial.decreaseStay,
                    $global.frontDeskAccessOrder.accessSpecial
                      .overrideRateOrDiscount,
                  ]
                );
              } else {
                this.isSaving = false;
                return this.showCredential(
                  this.$t("credential.title.businessSourceAndOverride"),
                  [
                    $global.frontDeskAccessOrder.accessSpecial
                      .overrideRateOrDiscount,
                    $global.frontDeskAccessOrder.accessSpecial.businessSource,
                  ]
                );
              }
            } else if (isDecreaseStay) {
              this.isSaving = false;
              return this.showCredential(
                this.$t("credential.title.businessSourceAndDecreaseStay"),
                [
                  $global.frontDeskAccessOrder.accessSpecial.decreaseStay,
                  $global.frontDeskAccessOrder.accessSpecial.businessSource,
                ]
              );
            } else {
              this.isSaving = false;
              return this.showCredential(
                this.$t("credential.title.businessSource"),
                $global.frontDeskAccessOrder.accessSpecial.businessSource
              );
            }
          } else {
            if (isOverrideDiscountRate) {
              if (isDecreaseStay) {
                this.isSaving = false;
                return this.showCredential(
                  this.$t("credential.title.overrideAndDecreaseStay"),
                  [
                    $global.frontDeskAccessOrder.accessSpecial.decreaseStay,
                    $global.frontDeskAccessOrder.accessSpecial
                      .overrideRateOrDiscount,
                  ]
                );
              } else {
                this.isSaving = false;
                return this.showCredential(
                  this.$t("credential.title.overrideRate"),
                  $global.frontDeskAccessOrder.accessSpecial
                    .overrideRateOrDiscount
                );
              }
            } else if (isDecreaseStay) {
              this.isSaving = false;
              return this.showCredential(
                this.$t("credential.title.decreaseStay"),
                $global.frontDeskAccessOrder.accessSpecial.decreaseStay
              );
            }
          }
        }
        const userID = userId;
        const rateOriginal = await this.getRoomRateAmount(true);
        const rateOriginalWeekday = rateOriginal.weekday_rate;
        const rateOriginalWeekend = rateOriginal.weekend_rate;
        const isDiscountLimitWeekday = await this.isDiscountLimit(
          userID,
          rateOriginalWeekday,
          this.detail.weekday_rate_total
        );
        const isDiscountLimitWeekend = await this.isDiscountLimit(
          userID,
          rateOriginalWeekend,
          this.detail.weekend_rate_total
        );
        if (
          isOverrideDiscountRate &&
          (isDiscountLimitWeekday || isDiscountLimitWeekend)
        ) {
          this.isSaving = false;
          return getToastInfo(this.$t("messages.reservationForm[22]"));
        }
      }

      // CheckIn
      if (this.modeData === $global.modeData.checkIn) {
        if (arrivalDate != auditDate) {
          this.isSaving = false;
          return this.toast.error(this.$t("messages.reservationForm[24]"));
        }
        if (this.detail.room_number == "") {
          this.isSaving = false;
          return this.toast.error(this.$t("messages.reservationForm[25]"));
        }
      }
    }
    this.submitForm();

    this.isSaving = false;
  }

  async handleClickSearchPhone1() {
    const loader = this.$loading.show();
    this.countGuestProfile = 0;
    this.guestProfileIndex = 0;
    if (this.tadaEnable) {
      await this.getTADAMemberDetail();
    } else {
      await this.getGuestProfileByPhoneNumber(this.profile1.phone1);
    }
    loader.hide();
  }

  async handleClickSearchGuestProfileByField(
    field: string,
    value: any,
    profile: any
  ) {
    const loader = this.$loading.show();
    this.countGuestProfile = 0;
    this.guestProfileIndex = 0;

    await this.getGuestProfileByField(field, value, false);

    loader.hide();
  }

  handlePrevGuestProfile() {
    if (this.countGuestProfile > 0) {
      if (this.guestProfileIndex > 0) {
        this.guestProfileIndex--;
        this.guestProfileDetail =
          this.guestProfileDetailList[this.guestProfileIndex];
      }
    }
  }
  handleNextGuestProfile() {
    if (this.countGuestProfile > 0) {
      if (this.guestProfileIndex < this.countGuestProfile - 1) {
        this.guestProfileIndex++;
        this.guestProfileDetail =
          this.guestProfileDetailList[this.guestProfileIndex];
      }
    }
  }
  async handleSaveGuestProfile() {
    if (this.isNewGuestProfileCreated) {
      getToastInfo(this.$t("messages.guestProfileAlreadyCreated"));
      return;
    }
    const loader = this.$loading.show();
    await this.saveNewGuestProfile(this.profile1);
    loader.hide();
  }

  handleLoadGuestDetail() {
    this.guestProfileNumber = 1;
    this.handleSelectDataGuestProfile(this.guestProfileDetail);
    this.showGuestProfileDetail = false;
  }

  handleLoadGuestProfile(profileNumber: number) {
    this.guestProfileNumber = profileNumber;
    this.showGuestProfile = true;
  }

  handleSelectDataGuestProfile(data: any) {
    if (this.guestProfileNumber == 1) {
      this.profile1 = data;
      this.form.guest_profile_id1 = data.id;
      this.guestGeneralData.guest_profile_id1 = data.id;
    } else if (this.guestProfileNumber == 2) {
      this.profile2 = data;
      this.form.guest_profile_id2 = data.id;
      this.guestGeneralData.guest_profile_id2 = data.id;
    } else if (this.guestProfileNumber == 3) {
      this.profile3 = data;
      this.form.guest_profile_id3 = data.id;
      this.guestGeneralData.guest_profile_id3 = data.id;
    } else if (this.guestProfileNumber == 4) {
      this.profile4 = data;
      this.form.guest_profile_id4 = data.id;
      this.guestGeneralData.guest_profile_id4 = data.id;
    } else if (this.guestProfileNumber == 5) {
      this.profile5 = data;
      this.form.guest_profile_id5 = data.id;
      this.guestGeneralData.guest_profile_id5 = data.id;
    } else if (this.guestProfileNumber == 6) {
      this.profile6 = data;
      this.form.guest_profile_id6 = data.id;
      this.guestGeneralData.guest_profile_id6 = data.id;
    } else if (this.guestProfileNumber == 7) {
      this.profile7 = data;
      this.form.guest_profile_id7 = data.id;
      this.guestGeneralData.guest_profile_id7 = data.id;
    } else if (this.guestProfileNumber == 8) {
      this.profile8 = data;
      this.form.guest_profile_id8 = data.id;
      this.guestGeneralData.guest_profile_id8 = data.id;
    } else if (this.guestProfileNumber == 9) {
      this.profile9 = data;
      this.form.guest_profile_id9 = data.id;
      this.guestGeneralData.guest_profile_id9 = data.id;
    } else if (this.guestProfileNumber == 10) {
      this.profile10 = data;
      this.form.guest_profile_id10 = data.id;
      this.guestGeneralData.guest_profile_id10 = data.id;
    }
    this.showGuestProfile = false;
  }

  submitForm() {
    this.form.member_code = this.detail.memberCode;
    if (this.isFromAllotment) {
      this.form.is_from_allotment = 1;
    }
    this.guestGeneralData.flight_arrival = formatDateTimeUTC(
      this.guestGeneralData.flight_arrival
    );
    this.guestGeneralData.flight_departure = formatDateTimeUTC(
      this.guestGeneralData.flight_departure
    );
    const params = {
      GuestProfileData1: cloneObject(this.profile1),
      GuestProfileData2: cloneObject(this.profile2),
      GuestProfileData3: cloneObject(this.profile3),
      GuestProfileData4: cloneObject(this.profile4),
      GuestProfileData5: cloneObject(this.profile5),
      GuestProfileData6: cloneObject(this.profile6),
      GuestProfileData7: cloneObject(this.profile7),
      GuestProfileData8: cloneObject(this.profile8),
      GuestProfileData9: cloneObject(this.profile9),
      GuestProfileData10: cloneObject(this.profile10),
      GuestDetailData: cloneObject(this.detail),
      GuestGeneralData: cloneObject(this.guestGeneralData),
      FormData: cloneObject(this.form),
    };

    params.GuestDetailData.arrival = formatDateTimeUTC(this.detail.arrival);
    params.GuestDetailData.arrival_res = formatDateTimeUTC(
      this.detail.arrival_res
    );
    params.GuestDetailData.departure_res = formatDateTimeUTC(
      this.detail.departure_res
    );
    params.GuestDetailData.departure = formatDateTimeUTC(this.detail.departure);
    params.GuestProfileData1.birth_date = formatDateTimeUTC(
      this.profile1.birth_date
    );
    params.GuestProfileData2.birth_date = formatDateTimeUTC(
      this.profile2.birth_date
    );
    params.GuestProfileData3.birth_date = formatDateTimeUTC(
      this.profile3.birth_date
    );
    params.GuestProfileData4.birth_date = formatDateTimeUTC(
      this.profile4.birth_date
    );
    params.GuestProfileData5.birth_date = formatDateTimeUTC(
      this.profile5.birth_date
    );
    params.GuestProfileData6.birth_date = formatDateTimeUTC(
      this.profile6.birth_date
    );
    params.GuestProfileData7.birth_date = formatDateTimeUTC(
      this.profile7.birth_date
    );
    params.GuestProfileData8.birth_date = formatDateTimeUTC(
      this.profile8.birth_date
    );
    params.GuestProfileData9.birth_date = formatDateTimeUTC(
      this.profile9.birth_date
    );
    params.GuestProfileData10.birth_date = formatDateTimeUTC(
      this.profile10.birth_date
    );

    this.$emit("save", params);
  }

  onInvalidSubmit(values: any) {
    focusOnInvalid();
  }

  async showCredential(title: string, accessMode: number | number[]) {
    this.credentialElement.showCredential({
      show: true,
      title,
      accessMode,
      onVerified: (val: any) => {
        this.onSubmit(null, true, val.userId);
      },
    });
  }

  resetProfile() {
    this.profile1 = {
      title_code: "",
      full_name: "",
      street: "",
      country_code: "",
      state_code: "",
      city_code: "",
      city: "",
      nationality_code: "",
      postal_code: "",
      phone1: "",
      phone2: "",
      fax: "",
      email: "",
      website: "",
      company_code: "",
      guest_type_code: "",
      id_card_code: "",
      id_card_number: "",
      is_male: 0,
      birth_place: "",
      birth_date: $global.nullDate,
      type_code: "G",
      custom_field01: "",
      custom_field02: "",
      custom_field03: "",
      custom_field04: "",
      custom_field05: "",
      custom_field06: "",
      custom_field07: "",
      custom_field08: "",
      custom_field09: "",
      custom_field10: "",
      custom_field11: "",
      custom_field12: "",
      custom_lookup_field_code01: "",
      custom_lookup_field_code02: "",
      custom_lookup_field_code03: "",
      custom_lookup_field_code04: "",
      custom_lookup_field_code05: "",
      custom_lookup_field_code06: "",
      custom_lookup_field_code07: "",
      custom_lookup_field_code08: "",
      custom_lookup_field_code09: "",
      custom_lookup_field_code10: "",
      custom_lookup_field_code11: "",
      custom_lookup_field_code12: "",
      is_active: 1,
      customer_code: "",
      source: $global.defaultSystemCode,
    };

    this.profile1Old = {};
    this.profile2Old = {};
    this.profile3Old = {};
    this.profile4Old = {};
    this.profile5Old = {};
    this.profile6Old = {};
    this.profile7Old = {};
    this.profile8Old = {};
    this.profile9Old = {};
    this.profile10Old = {};
    this.profile2 = {};
    this.profile3 = {};
    this.profile4 = {};
    this.profile5 = {};
    this.profile6 = {};
    this.profile7 = {};
    this.profile8 = {};
    this.profile9 = {};
    this.profile10 = {};
    this.profile2.is_male = 1;
    this.profile3.is_male = 1;
    this.profile4.is_male = 1;
    this.profile5.is_male = 1;
    this.profile6.is_male = 1;
    this.profile7.is_male = 1;
    this.profile8.is_male = 1;
    this.profile9.is_male = 1;
    this.profile10.is_male = 1;
    // for (const i in this.profile1) {
    //   this.profile2[i] = this.profile1[i];
    //   this.profile3[i] = this.profile1[i];
    //   this.profile4[i] = this.profile1[i];
    // }
  }

  public async resetForm() {
    this.modeData = $global.modeData.insert;
    this.isNewGuestProfileCreated = false;
    this.tabIndex = 0;
    this.detail = {};
    this.validate.resetForm();
    if (this.modeData !== $global.modeData.edit) {
      await this.getServerDateTime();
    }
    await nextTick();
    this.resetProfile();
    this.roomNumberList = [];
    this.bedTypeList = [];
    this.roomRateList = [];
    this.cityList = [];
    this.stateList = [];
    this.availableRoomCount = 0;
    this.reservationNumber = 0;
    this.folioNumber = 0;
    this.balance = 0;
    this.detail = {
      night: 1,
      arrival: this.dateTimeArrival,
      arrival_unixx: 1,
      arrival_res: this.dateTimeArrival,
      departure: this.dateTimeDeparture,
      departure_unixx: 1,
      departure_res: this.dateTimeDeparture,
      adult: 1,
      child: 0,
      room_type_code: "",
      bed_type_code: "",
      room_number: "",
      currency_code: this.defaultCurrency,
      exchange_rate: 1,
      is_constant_currency: 1,
      room_rate_code: "",
      is_override_rate: 0,
      weekday_rate: 0,
      weekend_rate: 0,
      discount_percent: 0,
      discount: 0,
      business_source_code: "",
      is_override_commission: 0,
      commission_type_code: "",
      commission_value: 0,
      payment_type_code: this.dvPaymentType ? this.dvPaymentType : "",
      market_code: this.dvMarket ? this.dvMarket : "",
      booking_source_code: "",
      bill_instruction: "",
    };
    this.guestGeneralData = {
      purpose_of_code: "",
      sales_code: "",
      voucher_number_ta: "",
      flight_number: "",
      flight_arrival: $global.nullDate,
      flight_departure: $global.nullDate,
      notes: "",
      show_notes: 0,
      hk_note: "",
      document_number: "",
      number: "",
      folio_number: "",
      balance: 0,
    };
    this.form = {
      number: "",
      reservation_by: "",
      group_code: "",
      member_code: "",
      is_incognito: 0,
      contact_person_id1: 0,
      contact_person_id2: 0,
      contact_person_id3: 0,
      contact_person_id4: 0,
      guest_detail_id: 0,
      guest_profile_id1: 0,
      guest_profile_id2: 0,
      guest_profile_id3: 0,
      guest_profile_id4: 0,
      guest_general_id: 0,
      status_code: $global.reservationStatus.new,
      status_code2: "T",
      is_lock: 0,
      is_from_allotment: 0,
      booking_code: "",
      ota_id: "",
      cm_res_status: "",
      is_cm_confirmed: 0,
      change_status_at: $global.nullDate,
      change_status_by: "",
      cancelled_at: $global.nullDate,
      cancelled_by: "",
      cancel_reason: "",
    };

    for (const i in this.detail) {
      this.formOld[i] = this.detail[i];
    }
    for (const i in this.guestGeneralData) {
      this.guestGeneralDataOld[i] = this.guestGeneralData[i];
    }
    for (const i in this.form) {
      this.formOld[i] = this.form[i];
    }
  }

  //use on insert reservation availability
  setArrivalDate(
    date: string,
    night: number,
    roomNumber: string,
    roomTypeCode: string,
    isWalkIn: boolean
  ) {
    if (!isWalkIn) {
      const time = formatTimeValue(this.serverDateTime);
      date = date ?? this.auditDate;
      const arrResv = formatDateTimeZone(`${formatDateDatabase(date)} ${time}`);
      this.detail.arrival = arrResv;
    }
    this.detail.night = night;
    this.detail.room_number = roomNumber;
    this.detail.room_type_code = roomTypeCode;
    this.getBedTypeList();
    this.getBedTypeCode();
    this.getRoomRate();

    this.onChangeNight();
  }

  toggleTimePanelDatePicker() {
    this.showTimePanel = !this.showTimePanel;
  }

  parseBoolean(params: any) {
    params.is_cm_confirmed = params.is_cm_confirmed ? true : false;
    params.discount_percent = params.discount_percent ? true : false;
    params.is_constant_currency = params.is_constant_currency ? true : false;
    params.is_from_allotment = params.is_from_allotment ? true : false;
    params.is_incognito = params.is_incognito ? true : false;
    params.is_lock = params.is_lock ? true : false;
    params.is_male_1 = params.is_male_1 ? true : false;
    params.is_male_2 = params.is_male_2 ? true : false;
    params.is_male_3 = params.is_male_3 ? true : false;
    params.is_male_4 = params.is_male_4 ? true : false;
    params.is_override_commission = params.is_override_commission
      ? true
      : false;
    params.is_override_rate = params.is_override_rate ? true : false;

    return params;
  }

  parseFloat(params: any) {
    params.commission_value = parseFloat(params.commission_value);
    params.exchange_rate = parseFloat(params.exchange_rate);
    params.discount = parseFloat(params.discount);

    return params;
  }

  setOldData() {
    for (const i in this.detail) {
      this.detailOld[i] = this.detail[i];
    }
    for (const i in this.guestGeneralData) {
      this.guestGeneralDataOld[i] = this.guestGeneralData[i];
    }
    for (const i in this.form) {
      this.formOld[i] = this.form[i];
    }
    for (const i in this.profile1) {
      this.profile1Old[i] = this.profile1[i];
      this.profile2Old[i] = this.profile2[i];
      this.profile3Old[i] = this.profile3[i];
      this.profile4Old[i] = this.profile4[i];
      this.profile5Old[i] = this.profile5[i];
      this.profile6Old[i] = this.profile6[i];
      this.profile7Old[i] = this.profile7[i];
      this.profile8Old[i] = this.profile8[i];
      this.profile9Old[i] = this.profile9[i];
      this.profile10Old[i] = this.profile10[i];
    }
  }

  setDiscountRate() {
    let discount1;
    let discount2;
    this.detail.weekday_rate = parseFloat(this.detail.weekday_rate);
    this.detail.weekend_rate = parseFloat(this.detail.weekend_rate);
    if (this.detail.discount > 0) {
      if (this.detail.discount_percent) {
        discount1 = (this.detail.weekday_rate * this.detail.discount) / 100;
        discount2 = (this.detail.weekend_rate * this.detail.discount) / 100;
      } else {
        discount1 = this.detail.discount;
        discount2 = this.detail.discount;
      }
    }
    this.detail.discount = parseFloat(this.detail.discount);
    this.detail.weekday_rate_total =
      this.detail.weekday_rate - (discount1 > 0 ? discount1 : 0);
    this.detail.weekend_rate_total =
      this.detail.weekend_rate - (discount2 > 0 ? discount2 : 0);
  }

  onClearProfile(profile: any, profileNumber: number) {
    if (profile.full_name)
      this.confirmationEl.showConfirmation({
        show: true,
        text: `Are you sure to clear this guest profile ${profile.full_name}?`,
        onConfirm: () => {
          if (profileNumber == 1) {
            this.profile1 = {
              is_male: 0,
            };
            let substituted = false;
            if (this.profile2.full_name) {
              substituted = true;
              this.form.guest_profile_id1 = this.form.guest_profile_id2;
              this.form.contact_person_id1 = this.form.contact_person_id2;
              this.form.contact_person_id2 = 0;
              this.form.guest_profile_id2 = 0;
              this.profile1 = cloneObject(this.profile2);
              this.profile2 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile3.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id3;
              this.form.contact_person_id1 = this.form.contact_person_id3;
              this.form.contact_person_id3 = 0;
              this.form.guest_profile_id3 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile3);
              this.profile3 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile4.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id4;
              this.form.contact_person_id1 = this.form.contact_person_id4;
              this.form.contact_person_id4 = 0;
              this.form.guest_profile_id4 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile4);
              this.profile4 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile5.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id5;
              this.form.contact_person_id1 = this.form.contact_person_id5;
              this.form.contact_person_id5 = 0;
              this.form.guest_profile_id5 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile5);
              this.profile5 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile6.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id6;
              this.form.contact_person_id1 = this.form.contact_person_id6;
              this.form.contact_person_id6 = 0;
              this.form.guest_profile_id6 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile6);
              this.profile6 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile7.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id7;
              this.form.contact_person_id1 = this.form.contact_person_id7;
              this.form.contact_person_id7 = 0;
              this.form.guest_profile_id7 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile7);
              this.profile7 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile8.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id8;
              this.form.contact_person_id1 = this.form.contact_person_id8;
              this.form.contact_person_id8 = 0;
              this.form.guest_profile_id8 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile8);
              this.profile8 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile9.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id9;
              this.form.contact_person_id1 = this.form.contact_person_id9;
              this.form.contact_person_id9 = 0;
              this.form.guest_profile_id9 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile9);
              this.profile9 = {
                is_male: 0,
              };
            }

            if (!substituted && this.profile10.full_name) {
              this.form.guest_profile_id1 = this.form.guest_profile_id10;
              this.form.contact_person_id1 = this.form.contact_person_id10;
              this.form.contact_person_id10 = 0;
              this.form.guest_profile_id10 = 0;
              substituted = true;
              this.profile1 = cloneObject(this.profile10);
              this.profile10 = {
                is_male: 0,
              };
            }
          }

          if (profileNumber == 2) {
            this.profile2 = {
              is_male: 0,
            };
          }

          if (profileNumber == 3) {
            this.profile3 = {
              is_male: 0,
            };
          }

          if (profileNumber == 4) {
            this.profile4 = {
              is_male: 0,
            };
          }

          if (profileNumber == 5) {
            this.profile5 = {
              is_male: 0,
            };
          }
          if (profileNumber == 6) {
            this.profile6 = {
              is_male: 0,
            };
          }
          if (profileNumber == 7) {
            this.profile7 = {
              is_male: 0,
            };
          }
          if (profileNumber == 8) {
            this.profile8 = {
              is_male: 0,
            };
          }
          if (profileNumber == 9) {
            this.profile9 = {
              is_male: 0,
            };
          }
          if (profileNumber == 10) {
            this.profile10 = {
              is_male: 0,
            };
          }
          // alert(profileNumber);
        },
      });
  }

  addZeroHour(i: any) {
    let a = i;
    if (a < 10) {
      a = `0${a}`;
    }
    return a;
  }

  async processRoom() {
    if (this.modeData === $global.modeData.edit && !this.isNewReservation)
      return;
    if (
      this.detail.room_type_code &&
      this.detail.arrival &&
      this.detail.departure &&
      new Date(this.detail.arrival).getTime() <
        new Date(this.detail.departure).getTime()
    ) {
      await this.getRoomCountAvailable();
      this.getRoomNumberList();
    }
  }

  public getTotalNights() {
    const date1 = new Date(formatDateDatabase(this.detail.arrival)).getTime();
    const date2 = new Date(formatDateDatabase(this.detail.departure)).getTime();
    const auditDate = new Date(this.auditDate).getTime();
    if (date1 >= date2) {
      this.detail.departure = this.dateTimeDepartureFromArrival;
    }
    if (
      (date1 < auditDate && this.modeDataValue === $global.modeData.insert) ||
      this.modeDataValue === $global.modeData.duplicate
    ) {
      this.detail.arrival = this.dateTimeArrival;
    }
    const date3 = new Date(formatDateDatabase(this.detail.arrival));
    const date4 = new Date(formatDateDatabase(this.detail.departure));

    // To calculate the time difference of two dates
    const diffInTime = date4.getTime() - date3.getTime();

    // To calculate the no. of days between two dates
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    // restrict negatif departure
    this.detail.night = diffInDays;
    if (this.detail.night > 0) {
      this.tempNights = this.detail.night;
    }
  }

  getDepartureDate() {
    const arrivalDate = new Date(this.detail.arrival);
    const date = arrivalDate.getDate() + this.detail.night;
    const timeDeparture = formatTimeValue(this.detail.departure);
    arrivalDate.setDate(date);
    const departureDate = formatDateDatabase(arrivalDate);
    this.detail.departure = formatDateTimeZone(
      `${departureDate} ${timeDeparture}`
    );
  }

  getArrivalDate() {
    if (this.detail.arrival < this.detail.departure) return;
    const departureDate = new Date(this.detail.departure);
    const date = departureDate.getDate() - this.detail.night;
    const timeArrival = formatTimeValue(this.detail.arrival);
    departureDate.setDate(date);
    const arrivalDate = formatDateDatabase(departureDate);
    this.detail.arrival = formatDateTimeZone(`${arrivalDate} ${timeArrival}`);
  }

  public handleSave() {
    this.validate.$el.requestSubmit();
  }

  validateRoomRate() {
    for (const i in this.optionsList.roomRate) {
      if (this.optionsList.roomRate[i].code === this.detail.room_rate_code) {
        console.log(this.optionsList.roomRate[i].code);
      }
    }
  }

  //DOM Handler
  onChangeNight() {
    if (this.detail.night > 0) {
      this.tempNights = this.detail.night;
      const departure = new Date(this.detail.arrival);
      const timeDeparture = formatTimeValue(this.detail.departure);
      const arrivalDate = new Date(this.detail.arrival).getDate();
      const departureDate =
        parseInt(arrivalDate.toString()) +
        parseInt(this.detail.night.toString());
      departure.setDate(departureDate);
      const dateDeparture = formatDateDatabase(departure);
      if (dateDeparture >= this.auditDate) {
        this.detail.departure = formatDateTimeZone(
          `${dateDeparture} ${timeDeparture}`
        );
      } else {
        this.getTotalNights();
      }
    } else {
      this.detail.night = this.tempNights;
    }
    this.processRoom();
  }

  onChangeCommissionType() {
    if (
      this.detail.commission_type_code != 5 &&
      this.detail.commission_type_code != 6
    ) {
      if (this.detail.commission_value > 100) {
        this.detail.commission_value = 0;
      }
    }
  }

  onChangeAdult() {
    if (this.detail.is_override_rate) return;
    if (!this.detail.room_rate_code) return;
    this.getRoomRateAmount(false);
  }

  onChangeOverrideCommission() {
    if (!this.detail.is_override_commission) {
      // this.detail.commission_type_code = "";
      // this.detail.commission_value = 0;
      if (this.detail.business_source_code && this.detail.room_rate_code) {
        this.getBusinessSourceCommissionRate();
      }

      // this.getBusinessSourceCommissionRate();
    }
  }

  onChangeOverrideRate() {
    if (!this.detail.is_override_rate) {
      this.detail.discount = 0;
      this.detail.discount_percent = 0;
      this.getRoomRateAmount(false);
    }
  }

  onClickSelect() {
    console.log("clicked");
  }

  onDoubleClickResvBy() {
    this.clickCount++;
    setTimeout(() => {
      this.clickCount = 0;
    }, 500);
    if (this.clickCount > 1) {
      this.form.reservation_by = this.profile1.full_name;
    }
  }

  onChangeRoomRate($event: any) {
    console.log("onChangeRoomRate");
    const value = $event.target.value;
    if (value === "on") {
      //checkbox handler
      if (!this.detail.is_override_rate) {
        this.detail.discount = 0;
        this.getRoomRateAmount(false);
      }
    } else {
      this.detail.room_rate_code = $event.target.value;
      this.getRoomRateAmount(false);
    }

    if (
      this.detail.business_source_code != "" &&
      this.detail.room_rate_code != ""
    ) {
      this.getBusinessSourceCommissionRate();
    }
  }

  async onChangeRoomType($event: any) {
    if (
      (this.formType === $global.formType.guestInHouse &&
        this.modeData == $global.modeData.edit) ||
      this.modeData == $global.modeData.checkIn
    ) {
      return;
    }
    this.detail.room_type_code = $event.target.value;
    if (
      this.detail.room_type_code == "" ||
      this.detail.room_type_code == undefined
    )
      return;
    this.detail.bed_type_code = "";
    this.getBedTypeList();
    this.getRoomRate();
    await this.getRoomCountAvailable();
    this.getRoomNumberList();
  }

  async onChangeBuildingFloor($event: any) {
    if (
      (this.formType === $global.formType.guestInHouse &&
        this.modeData == $global.modeData.edit) ||
      this.modeData == $global.modeData.checkIn
    ) {
      return;
    }
    this.$nextTick(async () => {
      this.detail.room_type_code = "";
      this.detail.bed_type_code = "";
      this.detail.room_rate_code = "";
      this.detail.room_number = "";
      this.getRoomType();
      // await this.getRoomCountAvailable();
      // this.getRoomNumberList();
    });
  }

  async onChangeBedType($event: any) {
    if (
      (this.formType === $global.formType.guestInHouse &&
        this.modeData == $global.modeData.edit) ||
      this.modeData == $global.modeData.checkIn
    ) {
      return;
    }
    this.detail.bed_type_code = $event.target.value;
    if (
      this.detail.bed_type_code == "" ||
      this.detail.bed_type_code == undefined
    )
      return;
    this.detail.room_number = "";
    await this.getRoomCountAvailable();
    this.getRoomNumberList();
  }

  async onChangeReadyRoom() {
    if (
      (this.formType === $global.formType.guestInHouse &&
        this.modeData == $global.modeData.edit) ||
      this.modeData == $global.modeData.checkIn
    ) {
      return;
    }
    await this.getRoomCountAvailable();
    if (this.detail.room_type_code && this.detail.bed_type_code)
      this.getRoomNumberList();
  }

  onChangeRoomNumber(event: any) {
    if (
      (this.formType === $global.formType.guestInHouse &&
        this.modeData == $global.modeData.edit) ||
      this.modeData == $global.modeData.checkIn
    ) {
      return;
    }
    if (event.target.value === "on") return;
    this.detail.room_number = event.target.value;
    if (this.detail.room_type_code && this.detail.room_number) {
      this.getBedTypeCode();
    }
  }

  onChangeBusinessSource() {
    //checkbox handler
    if (
      !this.detail.is_override_commission ||
      !this.detail.business_source_code
    ) {
      this.detail.commission_value = 0;
      this.detail.commission_type_code = "";
    }
    if (this.detail.room_type_code) this.getRoomRate();
    if (this.detail.business_source_code && this.detail.room_rate_code) {
      this.getBusinessSourceCommissionRate();
    }
  }

  onChangeMarket($event: any) {
    this.detail.market_code = $event.target.value;
    if (this.detail.room_type_code) this.getRoomRate();
  }

  onChangeCountry($event: any, profile: string) {
    this.getStateList(profile, $event.target.value);
  }

  onChangeState($event: any, profile: string) {
    this.getCityList(profile, $event.target.value);
  }

  onChangeCity(profile: any) {
    if (profile.city_code != "OTH") {
      profile.city = "";
    }
  }

  onChangeCurrency() {
    this.getExchangeRateCurrency();
  }

  onChangeMember() {
    this.$nextTick(() => {
      this.getMemberGuestProfile();
    });
  }

  onChangeArrival(): void {
    this.getDepartureDate();
    this.processRoom();
  }

  onChangeDeparture(): void {
    this.getArrivalDate();
    this.getTotalNights();
    this.processRoom();
  }

  onChangeDiscountRate() {
    this.setDiscountRate();
  }

  onChangeWeekdayRate() {
    this.setDiscountRate();
  }

  onChangeWeekendRate() {
    this.setDiscountRate();
  }

  onResetDate() {
    this.detail.arrival = this.dateTimeArrival;
    this.detail.departure = this.dateTimeDeparture;
    this.detail.night = 1;
  }

  public async onEdit(
    data: any,
    reservationNumber: number,
    folioNumber: number,
    isCheckIn?: boolean
  ) {
    this.loadEditData = true;
    let loader = this.$loading.show({
      container: this.registrationFormElement,
    });
    await this.resetForm();
    this.modeData = isCheckIn
      ? $global.modeData.checkIn
      : $global.modeData.edit;
    this.profile1 = data.GuestProfileData1;
    this.profile1.member_code = data.member_code;
    this.profile2 = data.GuestProfileData2;
    this.profile3 = data.GuestProfileData3;
    this.profile4 = data.GuestProfileData4;
    this.profile5 = data.GuestProfileData5;
    this.profile6 = data.GuestProfileData6;
    this.profile7 = data.GuestProfileData7;
    this.profile8 = data.GuestProfileData8;
    this.profile9 = data.GuestProfileData9;
    this.profile10 = data.GuestProfileData10;
    this.detail = data.GuestDetailData;
    this.detail.arrival = formatDateTimeZone(this.detail.arrival);
    this.detail.departure = formatDateTimeZone(this.detail.departure);
    this.guestGeneralData = data.GuestGeneralData;
    this.form =
      this.formType == $global.formType.guestInHouse
        ? data.FolioData
        : data.ReservationData;
    this.reservationNumber = reservationNumber;
    this.folioNumber = folioNumber;
    this.balance = data.Balance;

    this.setOldData();
    this.populateDataComboList();
    const rateOriginal = await this.getRoomRateAmount(true);
    const rateOriginalWeekday = rateOriginal.weekday_rate;
    const rateOriginalWeekend = rateOriginal.weekend_rate;
    if (
      this.detail.weekend_rate != rateOriginalWeekend ||
      this.detail.weekday_rate != rateOriginalWeekday
    ) {
      this.detail.is_override_rate = 1;
      this.detail.weekend_rate = this.detailOld.weekend_rate;
      this.detail.weekday_rate = this.detailOld.weekday_rate;
    }
    this.loadEditData = false;
    loader.hide();
  }

  async onDuplicate(data: any) {
    await this.resetForm();
    this.modeData = $global.modeData.duplicate;
    this.profile1 = data.GuestProfileData1;
    this.profile2 = data.GuestProfileData2;
    this.profile3 = data.GuestProfileData3;
    this.profile4 = data.GuestProfileData4;
    this.profile5 = data.GuestProfileData5;
    this.profile6 = data.GuestProfileData6;
    this.profile7 = data.GuestProfileData7;
    this.profile8 = data.GuestProfileData8;
    this.profile9 = data.GuestProfileData9;
    this.profile10 = data.GuestProfileData10;
    this.detail = data.GuestDetailData;
    this.detail.arrival = formatDateTimeZone(this.detail.arrival);
    this.detail.departure = formatDateTimeZone(this.detail.departure);
    this.guestGeneralData = data.GuestGeneralData;
    this.form =
      this.formType == $global.formType.guestInHouse
        ? data.FolioData
        : data.ReservationData;
    this.folioNumber = 0;
    this.balance = 0;
    this.populateDataComboList();
    this.detail.room_number = "";
    this.detail.number = "";
  }

  // API Request
  // ===========================================================================
  public async isDiscountLimit(
    userID: string,
    rateORI: number,
    rateOverride: number
  ) {
    let isLimit = true;
    try {
      const params = {
        UserID: userID,
        RateOriginal: rateORI,
        RateOverride: rateOverride,
      };
      const { data } = await registrationFormAPI.isDiscountLimit(params);
      isLimit = data;
    } catch (error: any) {
      throw getError(error);
    }
    return isLimit;
  }

  async populateDataComboList() {
    this.getComboList();
    this.getBedTypeList();
    if (this.profile2.full_name != "") {
      this.getCityList("2", this.profile2.state_code);
      this.getStateList("2", this.profile2.country_code);
    }
    if (this.profile3.full_name != "") {
      this.getCityList("3", this.profile3.state_code);
      this.getStateList("3", this.profile3.country_code);
    }
    if (this.profile4.full_name != "") {
      this.getCityList("4", this.profile4.state_code);
      this.getStateList("4", this.profile4.country_code);
    }
    if (this.profile5.full_name != "") {
      this.getCityList("5", this.profile5.state_code);
      this.getStateList("5", this.profile5.country_code);
    }
    if (this.profile6.full_name != "") {
      this.getCityList("6", this.profile6.state_code);
      this.getStateList("6", this.profile6.country_code);
    }
    if (this.profile7.full_name != "") {
      this.getCityList("7", this.profile7.state_code);
      this.getStateList("7", this.profile7.country_code);
    }
    if (this.profile8.full_name != "") {
      this.getCityList("8", this.profile8.state_code);
      this.getStateList("8", this.profile8.country_code);
    }
    if (this.profile9.full_name != "") {
      this.getCityList("9", this.profile9.state_code);
      this.getStateList("9", this.profile9.country_code);
    }
    if (this.profile10.full_name != "") {
      this.getCityList("10", this.profile10.state_code);
      this.getStateList("10", this.profile10.country_code);
    }
    this.getCityList("1", this.profile1.state_code);
    this.getStateList("1", this.profile1.country_code);
    this.getBedTypeList();
    this.getRoomRate();
    this.getTotalNights();
    this.setDiscountRate();
    await this.getRoomCountAvailable();
    this.getRoomNumberList();
  }

  public async getComboList(type = ""): Promise<void> {
    try {
      let params = [
        "BookingSource",
        "BusinessSource",
        "IDCardType",
        "CommissionType",
        "Company",
        "Country",
        "Currency",
        "GuestGroup",
        "GuestType",
        "Market",
        "Nationality",
        "PaymentType",
        "PurposeOf",
        "Building",
        "Floor",
        "RoomMember",
        "RoomType",
        "Sales",
        "GuestTitle",
      ];
      if (type != "") {
        params = [type];
      }
      const { data } = await registrationFormAPI.codeNameListArray(params);
      if (data) {
        if (type != "") {
          this.optionsList[type] = data[type];
        } else {
          this.optionsList = data;
        }
      }
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getBedTypeList(): Promise<void> {
    try {
      const { data } = await registrationFormAPI.getBedTypeList(
        this.detail.room_type_code.toString()
      );
      this.bedTypeList = data ? data : [];
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getRoomType(): Promise<void> {
    try {
      const { data } = await registrationFormAPI.getRoomTypeByBuildingFloor({
        Building: this.detail.building,
        Floor: this.detail.floor,
      });
      this.optionsList.RoomType = data ?? [];
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getBedTypeCode(): Promise<void> {
    try {
      const { data } = await registrationFormAPI.getBedTypeCode(
        this.detail.room_number
      );
      this.detail.bed_type_code = data ? data.code : "";
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getRoomNumberList(): Promise<void> {
    let guestInHouseRoomReady = true;
    if (this.formType == $global.formType.guestInHouse) {
      if (this.modeData == $global.modeData.edit) {
        guestInHouseRoomReady = false;
      }
    }
    try {
      const params = {
        RoomTypeCode: this.detail.room_type_code,
        BedTypeCode: this.detail.bed_type_code,
        ArrivalDate: formatDateTimeUTC(this.detail.arrival),
        DepartureDate: formatDateTimeUTC(this.detail.departure),
        ReservationNumber: this.reservationNumber,
        FolioNumber: this.folioNumber,
        RoomUnavailableID: 0,
        RoomAllotmentID: 0,
        ReadyOnly:
          this.formType == $global.formType.guestInHouse
            ? guestInHouseRoomReady
            : this.isReadyRoom,
        AllotmentOnly: this.isFromAllotment,
      };
      const { data } = await registrationFormAPI.getRoomNumberList(params);
      if (this.modeData == $global.modeData.edit) {
        return (this.roomNumberList = data ? data : []);
      }
      this.roomNumberList = data && this.availableRoomCount > 0 ? data : [];
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getRoomCountAvailable(): Promise<void> {
    let guestInHouseRoomReady = true;
    if (this.formType == $global.formType.guestInHouse) {
      if (this.modeData == $global.modeData.edit) {
        guestInHouseRoomReady = false;
      }
    }
    try {
      const params = {
        RoomTypeCode: this.detail.room_type_code,
        BedTypeCode: this.detail.bed_type_code,
        ArrivalDate: formatDateTimeUTC(this.detail.arrival),
        DepartureDate: formatDateTimeUTC(this.detail.departure),
        ReservationNumber: this.reservationNumber,
        FolioNumber: this.folioNumber,
        RoomUnavailableID: 0,
        RoomAllotmentID: 0,
        ReadyOnly:
          this.formType == $global.formType.guestInHouse
            ? guestInHouseRoomReady
            : this.isReadyRoom,
        AllotmentOnly: this.isFromAllotment,
      };
      const { data } = await registrationFormAPI.getRoomAvailable(params);
      this.availableRoomCount = data;
      if (this.formType == $global.formType.guestGroup) {
        this.$emit("availableRoomCount", data);
      }
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getMemberGuestProfile() {
    try {
      const memberCode = this.profile1.member_code;
      if (!memberCode) return;
      const { data } = await registrationFormAPI.getMemberGuestProfile(
        memberCode
      );

      this.form.guest_profile_id1 = data.id;
      this.profile1 = data;
      this.profile1.member_code = memberCode;
    } catch (error: any) {
      getError(error);
    }
  }

  public async getRoomRate() {
    try {
      const params = {
        RoomTypeCode: this.detail.room_type_code,
        BusinessSourceCode: this.detail.business_source_code,
        MarketCode: this.detail.market_code,
        CompanyCode: this.profile1.company_code,
        ArrivalDate: formatDateTimeUTC(this.detail.arrival),
      };
      const { data } = await registrationFormAPI.getRoomRate(params);
      this.roomRateList = data ?? [];
      if (!data) {
        this.detail.room_rate_code = "";
        this.detail.weekday_rate = "";
        this.detail.weekend_rate = "";
        this.detail.weekday_rate_total = "";
        this.detail.weekend_rate_total = "";
      }
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getRoomRateAmount(isReturn: boolean) {
    if (this.loadEditData && !isReturn) return;
    try {
      const params = {
        RoomRateCode: this.detail.room_rate_code,
        PostingDateStr: formatDateTimeUTC(this.detail.arrival),
        Adult: this.detail.adult,
        Child: this.detail.child,
      };
      const { data } = await registrationFormAPI.getRoomRateAmount(params);
      if (isReturn) return data;
      this.detail.weekday_rate = data.weekday_rate;
      this.detail.weekend_rate = data.weekend_rate;
      if (
        this.modeData === $global.modeData.insert ||
        this.modeData === $global.modeData.duplicate
      ) {
        this.detailOld.weekday_rate = data.weekday_rate;
        this.detailOld.weekend_rate = data.weekend_rate;
      }
      this.setDiscountRate();
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getExchangeRateCurrency() {
    try {
      if (!this.detail.currency_code) return;
      const { data } = await registrationFormAPI.detailData(
        "Currency",
        this.detail.currency_code
      );
      if (data) {
        this.detail.exchange_rate = Number(data.data.exchange_rate);
      }
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getBusinessSourceCommissionRate(originOnly: boolean = false) {
    const params = {
      BusinessSourceCode: this.detail.business_source_code,
      RoomRateCode: this.detail.room_rate_code,
    };
    try {
      const { data } =
        await registrationFormAPI.getBusinessSourceCommissionRate(params);
      this.originalBusinessSourceCommission = {
        commission_type_code: data ? data.commission_type_code : "",
        commission_value: data ? anyToFloat(data.commission_value) : 0,
      };
      if (originOnly) return;
      this.detail.commission_type_code = data ? data.commission_type_code : "";
      this.detail.commission_value = data
        ? anyToFloat(data.commission_value)
        : 0;
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getStateList(profile: string, countryCode: any) {
    try {
      if (!countryCode) return;
      const { data } = await registrationFormAPI.getStateByCountry(countryCode);
      this.stateList[profile] = data ? data : [];
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getCityList(profile: string, stateCode: any) {
    try {
      if (!stateCode) return;
      const { data } = await registrationFormAPI.getCityByState(stateCode);
      this.cityList[profile] = data ?? [];
    } catch (error: any) {
      throw getError(error);
    }
  }

  public async getTADAMemberDetail() {
    try {
      const { data } = await tadaMemberAPI.getTADAMemberDetail(
        this.profile1.phone1
      );
      if (data[0] && data[0].card) {
        await this.getTADACardDetail(data[0].card.no);
      } else if (data.card) {
        await this.getTADACardDetail(data.card.no);
      } else {
        this.getGuestProfileByPhoneNumber(this.profile1.phone1);
      }
    } catch (error: any) {
      getError(error);
    }
  }

  public async getTADACardDetail(cardNumber: string) {
    try {
      const { data } = await tadaMemberAPI.getTADACardDetail(cardNumber);
      const user = data.user;
      if (user) {
        this.guestProfileDetail = {
          full_name: user.name,
          city: user.city,
          phone1: user.phone,
          street: user.address,
          birth_day: user.birthday,
          is_male: user.sex == "male" ? 1 : 0,
          sex: user.sex,
          city_code: "OTH",
          country_code: "IDN",
          email: user.email,
          tp_type_code: "TADA",
          image_url: user.imageUrl,
          balance: user.balance,
          status: data.status,
          tp_member_code: data.card.no,
          id: 0,
        };
        this.guestProfileDetail.id = await this.getGuestProfileByPhoneNumber(
          this.profile1.phone1,
          true
        );
      }

      this.showGuestProfileDetail = true;
    } catch (error: any) {
      console.log(error);
      // getError(error);
    }
  }

  public async getGuestProfileByPhoneNumber(
    phoneNumber: string,
    IDOnly = false
  ) {
    try {
      const { data } = await guestProfileAPI.GetGuestProfileByPhoneNumber(
        phoneNumber
      );
      this.guestProfileIndex = 0;
      this.guestProfileDetailList = data;
      if (data && data.length > 0) {
        if (IDOnly) {
          return data[0].id;
        }
        this.countGuestProfile = data.length;
        this.guestProfileDetail = data[0];
        this.showGuestProfileDetail = true;
      }
    } catch (error: any) {
      if (IDOnly) return 0;
      getError(error);
    }
    return 0;
  }

  public async getGuestProfileByField(
    field: string,
    value: any,
    showError = true,
    IDOnly = false
  ) {
    const params = {
      Field: field,
      Value: value,
    };
    try {
      const { data } = await guestProfileAPI.GetGuestProfileByField(params);
      this.guestProfileIndex = 0;
      this.guestProfileDetailList = data;
      if (data && data.length > 0) {
        if (IDOnly) {
          return data[0].id;
        }
        this.countGuestProfile = data.length;
        this.guestProfileDetail = data[0];
        this.showGuestProfileDetail = true;
      }
    } catch (error: any) {
      if (IDOnly) return 0;
      if (showError) {
        getError(error);
      }
    }
    return 0;
  }
  public async saveNewGuestProfile(profile: any) {
    try {
      profile.birth_date = formatDateTimeZeroUTC(profile.birth_date);
      const { data } = await guestProfileAPI.InsertGuestProfile(profile);
      this.form.guest_profile_id1 = data.id;
      getToastSuccess(
        this.$t("messages.guestProfileSuccessfullyCreated") + ": " + data.id
      );
      this.isNewGuestProfileCreated = true;
    } catch (error: any) {
      getError(error);
    }
  }
  // ===============================================================
  // API REQUEST END

  dateDisabledArrival(date: any) {
    let dateX = new Date(this.auditDate);
    let currentDate = dateX.getDate() - 1;
    if (
      this.formType === $global.formType.guestInHouse &&
      this.modeData == $global.modeData.edit
    ) {
      dateX = new Date(this.detailOld.arrival);
      currentDate = dateX.getDate();
    }

    dateX.setDate(currentDate);
    return date < dateX;
  }

  dateDisabledDeparture(date: any) {
    const audit = new Date(this.auditDate);
    return date < audit;
  }

  public mounted(): void {
    // LOAD API
    if (this.modeData === $global.modeData.edit) return;
    this.getComboList();
  }

  get dateTimeDeparture() {
    const arrival = formatDateDatabase(this.auditDate);
    const departure = new Date(
      formatDateTimeZone(`${arrival} ${this.checkOutLimit}`)
    );
    departure.setDate(departure.getDate() + 1);

    return formatDateTimeZone(departure);
  }

  get dateTimeDepartureFromArrival() {
    const arrival = formatDateDatabase(this.detail.arrival);
    const departure = new Date(
      formatDateTimeZone(`${arrival} ${this.checkOutLimit}`)
    );
    departure.setDate(departure.getDate() + 1);
    return formatDateTimeZone(departure);
  }

  async getServerDateTime() {
    this.config.getAuditDate();
    this.serverDateTime = await getServerDateTime();
  }

  get dateTimeArrival() {
    const time = formatTimeValue(this.serverDateTime);
    const arrResv = formatDateTimeZone(`${this.auditDate} ${time}`);
    return arrResv;
  }

  get checkOutLimit() {
    return this.config.checkOutLimit;
  }
  get auditDate() {
    return this.config.auditDate;
  }
  // INPUT FIELD REQUIRED
  get isTitleRequired() {
    return this.config.isTitleRequired;
  }
  get isTAVoucherRequired() {
    return this.config.isTAVoucherRequired;
  }
  get isStateRequired() {
    return this.config.isStateRequired;
  }
  get isRoomNumberRequired() {
    return this.config.isRoomNumberRequired;
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
  get isHKNoteRequired() {
    return this.config.isHKNoteRequired;
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
  get isBusinessSourceRequired() {
    return this.config.isBusinessSourceRequired;
  }
  // DEFAULT VARIABLE
  get dvRoomType() {
    return this.config.dvRoomType;
  }
  get dvRoomRate() {
    return this.config.dvRoomRate;
  }
  get dvSubDepartment() {
    return this.config.dvSubDepartment;
  }
  get dvPaymentType() {
    return this.config.dvPaymentType;
  }
  get dvComplimentRate() {
    return this.config.dvComplimentRate;
  }
  get dvHouseUseRate() {
    return this.config.dvHouseUseRate;
  }
  get dvMarket() {
    return this.config.dvMarket;
  }
  get dvIndividualMarket() {
    return this.config.dvIndividualMarket;
  }
  // GLOBAL ACCOUNT
  get ccAdmin() {
    return this.config.cCAdmin;
  }
  get cash() {
    return this.config.cash;
  }
  get sdFrontOffice() {
    return this.config.sdFrontOffice;
  }
  get defaultCurrency() {
    return this.config.defaultCurrency;
  }

  get tadaEnable() {
    return this.config.tadaEnable;
  }
  get numberOfGuestProfile() {
    return anyToFloat(this.config.numberOfGuestProfile);
  }
  get disabledEditData() {
    return false;
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      Title: this.isTitleRequired ? Yup.string().required() : null,
      "Full Name": Yup.string().required(),
      "Reservation By":
        this.formType !== $global.formType.guestInHouse
          ? Yup.string().required()
          : null,
      "Arrival date": Yup.string().required(),
      "Departure date": Yup.string().required(),
      "Bed Type": Yup.string().required(),
      "Room Type": Yup.string().required(),
      "Payment Type": Yup.string().required(),
      "Room Rate": Yup.string().required(),
      State: this.isStateRequired ? Yup.string().required() : null,
      "TA Voucher": this.isTAVoucherRequired ? Yup.string().required() : null,
      "Room Number": this.isRoomNumberRequired ? Yup.string().required() : null,
      "Phone 1": this.isPhone1Required ? Yup.string().required() : null,
      Nationality: this.isNationalityRequired ? Yup.string().required() : null,
      Market: this.isMarketRequired ? Yup.string().required() : null,
      "HK Note": this.isHKNoteRequired ? Yup.string().required() : null,
      Email: this.isEmailRequired ? Yup.string().required() : null,
      Company: this.isCompanyRequired ? Yup.string().required() : null,
      City: this.isCityRequired ? Yup.string().required() : null,
      "Business Source": this.isBusinessSourceRequired
        ? Yup.string().required()
        : null,
      "Room Count":
        this.formType === $global.formType.guestGroup
          ? Yup.number().min(1).max(this.availableRoomCount).required()
          : null,
      Adult: Yup.number().min(1).max(100).required(),
    });
  }
}
