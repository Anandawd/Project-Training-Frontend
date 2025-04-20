import { Options, Vue } from "vue-class-component";
import ChargeForm from "./components/charge-form/charge-form.vue";
import ReservationListForm from "./components/reservation-list-form/reservation-list-form.vue";
import RemarkForm from "./components/remark-form/remark-form.vue";
import BookingInformationForm from "./components/booking-information-form/booking-information-form.vue";
import Deposit from "../../deposit/deposit.vue";
import CCheckbox from "@/components/checkbox/checkbox.vue";
import { BTabs, BTab } from "bootstrap-vue-3";
import { ref } from "vue";
import authModule from "@/stores/auth";
import { getError } from "@/utils/general";
import BookingApi from "@/services/api/banquet/booking";
import { formatDateTimeUTC } from "@/utils/format";
const bookingApi = new BookingApi();

@Options({
  components: {
    BTabs,
    BTab,
    RemarkForm,
    Deposit,
    ChargeForm,
    ReservationListForm,
    BookingInformationForm,
    CCheckbox,
  },
  props: {
    title: {
      type: String,
      require: true,
    },
    formType: {
      type: String,
      require: true,
    },
    isSaved: {
      type: Boolean,
      require: true,
      default: true
    },
    isSaving: {
      type: Boolean,
      require: true
    },
    modeData: {
      type: Number,
      require: true
    },
    isDeposit: {
      type: Boolean,
      require: true,
      default: false
    },
    isUpdateResBV: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  emits: [],
})
export default class BookingForm extends Vue {
  public auth = authModule();
  bookingInformationForm: any = ref()
  chargeFormElement: any = ref()
  remarkData: any = []
  bookingByResv: any = []
  remarkFormElement: any = ref()
  reservationListElement: any = ref()
  depositForm: any = ref()
  isSaved: boolean
  isSaving: boolean
  formType: string;
  isDeposit: boolean
  isBanquet: boolean = true
  reservationNumber: number = 0
  tabIndex: any = ref()
  isUpdateResBV: boolean
  bFocus: boolean = true
  dFocus: boolean = false
  kFocus: boolean = false

  // GENERAL FUNCTION ================================================================
  async initialize(data: any) {
    if (this.isUpdateResBV) {
      await this.getBookingByResv(data.booking_number)
    }

    await this.$nextTick(() => {
      if (this.formType == this.$global.formType.booking || this.formType == this.$global.formType.banquetInProgress) {
        this.bookingInformationForm.initialize(data)
        this.remarkFormElement.initialize(data)
      } else if (this.formType == this.$global.formType.banquetView) {
        let bookingData = !this.isUpdateResBV ? undefined : this.bookingByResv
        this.bookingInformationForm.initialize(data)
        this.remarkFormElement.initialize(bookingData)
      }
      if (data) {
        if (this.formType != this.$global.formType.banquetView) {
          this.depositForm.onRefreshData(data.booking_number)
        }
        this.reservationNumber = this.isUpdateResBV ? data.number : data.booking_number
      }

      this.reservationListElement.initialize(data)
      if (data) {
        let folioNumber = data.folio_number ? data.folio_number : null

        // if (!this.isUpdateResBV) {
        this.chargeFormElement.initialize(folioNumber)
        // }
      }
    })
    this.checkActiveTab();
  }

  onSubmit() {
    this.remarkFormElement.remarkInformationValidation.$el.requestSubmit()
    this.bookingInformationForm.bookInformationValidation.$el.requestSubmit()
  }

  async handleSaveRemark(remarkData: any) {
    this.remarkData = remarkData
  }

  handleSave(formData: any) {

    const cloneObject = JSON.parse(JSON.stringify(formData));
    cloneObject.guest_detail_data.arrival = formatDateTimeUTC(cloneObject.guest_detail_data.arrival)
    cloneObject.guest_detail_data.departure = formatDateTimeUTC(cloneObject.guest_detail_data.departure)
    cloneObject.booking_data.beo_note = this.remarkData[0]
    cloneObject.remark = this.remarkData[1]
    
    this.$emit("save", cloneObject)
  }

  onRefreshTable() {
    this.$emit("refresh")
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  onClose() {
    this.$emit("close");
  }

  checkActiveTab() {
    this.tabIndex = this.isDeposit ? 2 : this.isUpdateResBV ? 1 : 0
  }

  async onTabClick(v: any) {
    await this.$nextTick(() => {
      this.bFocus = v == "B"
      this.dFocus = v == "D"
      this.kFocus = v == "K"
    })
  }
  // END HANDLE UI====================================================================

  // API REQUEST======================================================================
  async getBookingByResv(bookingNum: any) {
    try {
      const { data } = await bookingApi.getBooking(bookingNum)
      this.bookingByResv = data
    } catch (error) {
      getError(error)
    }
  }
  // END API REQUEST==================================================================

  // RECYCLE LIFE FUNCTION ===========================================================

  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================

  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
