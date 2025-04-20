import { Options, Vue } from "vue-class-component";
import { ref, reactive } from "vue";
import CDialog from "@/components/dialog/dialog.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import CRadio from "@/components/radio/radio.vue";
import { getServerDateTime } from "@/utils/general";
import * as Yup from "yup";
import CInput from "@/components/input/input.vue";
import CSelect from "@/components/select/select.vue";
import ConfigStore from "@/stores/config";
import { focusOnInvalid, setInputFocus } from "@/utils/validation";
import { formatDateDatabase, formatDateTimeUTC, formatTimeValue, formatDateTimeZone } from "@/utils/format";
const configStore = ConfigStore();

@Options({
  components: {
    CDialog,
    CRadio,
    CDatepicker,
    CInput,
    CSelect
  },
  props: {
    formType: {
      type: String,
      require: true,
    },
    isSaving: {
      type: Boolean,
      require: true
    },
    modeData: {
      type: Number,
      require: true,
    },
    focus: {
      type: Boolean,
      default: false
    }
  },
  emits: [""],
})
export default class ReservationForm extends Vue {
  public detail: any = reactive({})
  public listDropdown: any = []
  public modeData: any
  serverDateTime: Promise<any>;
  dateForTime: any
  reservationFormValidate: any = ref()
  reservationFormElement: any = ref()
  BookingDate: string
  focus: boolean
  // GENERAL FUNCTION ================================================================
  onSubmit() {
    this.reservationFormValidate.$el.requestSubmit()
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  loadDropdown() {
    this.$emit("onLoadDropDown");
  }

  async initialize(bookingDate?: string) {
    if (bookingDate) {
      this.BookingDate = bookingDate
    }
    await this.$nextTick(() => {
      this.resetForm()
    })
  }

  async onEdit(data: any) {
    await this.$nextTick(() => {
      data.start_time = formatTimeValue(formatDateTimeZone(data.start_date))
      data.end_time = formatTimeValue(formatDateTimeZone(data.end_date))
      data.start_date = formatDateTimeZone(data.start_date)
      data.end_date = formatDateTimeZone(data.end_date)
    })

    this.detail = await data
  }

  onClose() {
    this.$emit("close");
  }

  dateDisabledArrival(date: any) {
    let dateX = new Date(this.auditDate);
    let currentDate = dateX.getDate() - 1;
    dateX.setDate(currentDate);
    return date < dateX;
  }

  dateDisabledDeparture(date: any) {
    const audit = new Date(this.auditDate);
    return date < audit;
  }

  getUTCTime(timeUTC: string) {
    const date = new Date(timeUTC)
    let diff = date.getTimezoneOffset()
    date.setHours(date.getHours() + (diff / 60))
    return date
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async resetForm() {
    this.reservationFormValidate.resetForm();
    await this.$nextTick();
    await this.getServerDateTime();

    this.detail = {
      is_inside: 1,
      start_date: this.dateStartDate,
      end_date: this.dateStartDate,
      start_time: formatTimeValue(this.BookingDate),
      end_time: this.getTimeEndDate(this.BookingDate),
      adult: 1
    }

    setInputFocus()
  }

  getTimeEndDate(bookingDate: any) {
    const date = new Date(bookingDate)
    date.setHours(date.getHours() + 1)

    return formatTimeValue(date);
  }

  // creating timezone offset, since using formatDateTimeZone just adding 8 hours ahead to my date (below)
  getTimezoneOffset() {
    const now = new Date();
    const diff = now.getTimezoneOffset();
    const offsetHour = Math.floor(Math.abs(diff) / 60);
    const offsetMinute = Math.abs(diff) % 60;
    const sign = diff <= 0 ? "+" : "-";
    const offsetStr = `${sign}${String(offsetHour).padStart(2, '0')}${String(offsetMinute).padStart(2, '0')}`;

    return offsetStr
  }

  onSave() {
    const startDate = this.detail.start_date.substring(0, 10)
    const endDate = this.detail.end_date.substring(0, 10)
    this.detail.child = this.detail.child ?? 0
    this.detail.adult = this.detail.adult ?? 0
    this.detail.is_inside = this.detail.is_inside == 1 ? true : false
    // manipulate date
    this.detail.startDate = startDate + "T" + this.detail.start_time + this.getTimezoneOffset()
    this.detail.endDate = endDate + "T" + this.detail.end_time + this.getTimezoneOffset()

    this.$emit("save", this.detail)
  }

  onChangeStartDate() {
    this.detail.end_date = this.detail.start_date;
  }

  timeStringToDate(timeString: any) {
    if (timeString) {
      let today = new Date();
      let [hours, minutes, seconds] = timeString.split(':');
      today.setHours(hours, minutes, seconds, 0);
      return today;
    }
  }
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async getServerDateTime() {
    configStore.getAuditDate();
    this.serverDateTime = await getServerDateTime();
    this.dateForTime = await getServerDateTime()
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  async mounted() {
    await this.resetForm()
  }

  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get dateStartDate() {
    const arrResv = formatDateDatabase(`${this.auditDate}`);
    return arrResv;
  }

  // get timeStartDate() {
  //   const time = formatTimeValue(this.serverDateTime);
  //   return time;
  // }

  // get timeEndDate() {
  //   const date = new Date(this.dateForTime)
  //   date.setHours(date.getHours() + 1)
  //   const newTime = formatDateTimeUTC(date)
  //   const formatTime = newTime.slice(11, 19)
  //   return formatTime;
  // }

  get auditDate() {
    return configStore.auditDate;
  }

  //Validation
  get schema() {
    return Yup.object().shape({
      "Start Date": Yup.string().required(),
      "End Date": Yup.string().required(),
      Venue: Yup.string().required(),
      Theme: Yup.string().required(),
      "Seating Plan": Yup.string().required(),
      Adult: Yup.number().required(),
      "Start Time": Yup.string().required(),
      "End Time": Yup.string().required().test((val: any) => {
        return this.timeStringToDate(val) > this.timeStringToDate(this.detail.start_time)
      }),
    });
  }
  // END GETTER AND SETTER ===========================================================
}