import { Options, Vue } from "vue-class-component";
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
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";
import { getError } from "@/utils/general";
import BookingApi from "@/services/api/banquet/booking";
import { formatDateDatabase } from "@/utils/format";
const bookingApi = new BookingApi();

@Options({
  name: "InputFormProduct",
  components: {
    Form,
    CRadio,
    CSelect,
    CDatepicker,
    CInput,
    Checkbox,
    CCheckbox,
    // myUpload,
    ColorPicker
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
    schema: {
      type: Object,
      require: true,
    },
    defaultForm: {
      type: Object,
      require: false,
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
      default: false
    }
  },
  emits: ["save", "close"],
})
export default class InputFormProduct extends Vue {
  isSaving: boolean = false;
  isDisable: boolean = true;
  inputFormProductElement: any = ref();
  modeData: any;
  columnOptions: any
  bookingNumber: number
  public defaultForm: any = {};
  public form: any = reactive({});
  public colorFormElement: any = ref()
  href: string
  copiedImg: string = ""
  show: boolean = false
  imgDataUrl: string = ""
  isWidgetValue: boolean = false
  handler: any
  comboList: any = [];
  productList: any = []
  public pureColor: any
  // public gradientColor: any = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");
  public formType: any
  // TODO: bagian price belum muncul, mungkin salah API kali yak?
  ColumnProductOptions = [
    {
      label: "name",
      field: "name",
      align: "left",
      width: "100",
      filter: true
    },
    {
      label: "price",
      field: "price",
      align: "right",
      width: "150",
      format: "number",
      filter: true
    },
  ];
  ColumnResOptions = [
    {
      label: "number",
      field: "Number",
      align: "left",
      width: "75",
      filter: true
    },
    {
      label: "venue",
      field: "Venue",
      align: "left",
      width: "100",
      filter: true
    },
    {
      label: "date",
      field: "Date",
      align: "left",
      width: "150",
      format: "date",
      filter: true
    },
    {
      label: "startTime",
      field: "Start Time",
      align: "left",
      width: "100",
      filter: true
    },
    {
      label: "endTime",
      field: "End Time",
      align: "left",
      width: "100",
      filter: true
    },
  ];
  focus: boolean

  // GENERAL FUNCTION ================================================================
  onChangeReservation() {
    const selectedRes = this.comboList.Reservation.find((el: any) => el.Number == this.form.reservation_number)
    this.form.served_date = selectedRes.Date
    this.form.start_time = selectedRes["Start Time"] + this.getTimezoneOffset()
    this.form.end_time = selectedRes["End Time"] + this.getTimezoneOffset()
    this.form.venue_code = selectedRes.VenueCode
  }

  getTimezoneOffset() {
    const date = new Date()
    const offsetInMinutes = date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offsetInMinutes / 60));
    const offsetMinutes = Math.abs(offsetInMinutes % 60);
    const offsetSign = offsetInMinutes < 0 ? '+' : '-';
    const timezoneString = `${offsetSign}${String(offsetHours).padStart(2, '0')}${String(offsetMinutes).padStart(2, '0')}`;

    return timezoneString
  }

  onChangeDiscountPercent() {
    this.form.discount = 0
  }

  onChangePrice() {
    this.form.sub_total = this.form.quantity * this.form.price
    this.form.amount = this.form.quantity * this.form.price
  }

  onChangeDiscount() {
    const discount = this.form.discount_percent ? (this.form.discount * this.form.sub_total / 100) : this.form.discount
    this.form.amount = this.form.sub_total - discount
  }

  onChangeStartTime() {
    if (this.form.start_time > this.form.end_time) {
      this.form.end_time = this.form.start_time
    }
  }

  onChangeEndTime() {
    if (this.form.start_time > this.form.end_time) {
      this.form.start_time = this.form.end_time
    }
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async resetForm() {
    this.inputFormProductElement.resetForm();
    await this.$nextTick();
    if (this.defaultForm != 0) {
      this.form = this.defaultForm;
      this.imgDataUrl = ""
    }

  }

  async initialize() {
    await this.$nextTick(() => {
      this.resetForm();
      this.loadProductComboList()
    });

    setInputFocus()    
  }

  onSubmit() {
    this.inputFormProductElement.$el.requestSubmit();
  }

  onSave() {
    if (this.formType == this.$global.formType.seatingPlan) {
      this.form.image = btoa(this.imgDataUrl)
    }

    this.form.served_date = formatDateDatabase(this.form.served_date)
    this.$emit("save", this.form);
  }

  onClose() {
    this.$emit("close");
  }

  // for add image in input form
  onClickResetImage() {
    this.imgDataUrl = ""
  }

  toggleShow() {
    this.show = !this.show;
  }

  cropSuccess(imgDataUrl: any, field: any) {
    this.imgDataUrl = imgDataUrl
    this.href = imgDataUrl
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
            this.copyImage(this.imgDataUrl)
          },
          icon: h('img', {
            src: '/public/images/icons/add_icon24.png',
            style: {
              width: '20px',
              height: '20px',
            }
          }),
          disabled: this.imgDataUrl == '' ? true : false
        },
        {
          label: "Paste",
          onClick: () => {
            this.pasteImage(this.copiedImg)
          },
          icon: h('img', {
            src: '/public/images/icons/add_icon24.png',
            style: {
              width: '20px',
              height: '20px',
            }
          }),
          disabled: this.copiedImg == '' ? true : false
        },
        {
          label: "Delete",
          onClick: () => {
            this.onClickResetImage()
          },
          icon: h('img', {
            src: '/public/images/icons/delete_icon24.png',
            style: {
              width: '20px',
              height: '20px',
            }
          }),
          disabled: this.imgDataUrl == '' ? true : false,
          divided: true,
        },
        {
          label: "Load",
          onClick: () => {
            this.toggleShow()
          },
          icon: h('img', {
            src: '/public/images/icons/add_icon24.png',
            style: {
              width: '20px',
              height: '20px',
            }
          }),
        },
        {
          label: "Save As",
          onClick: () => {
            this.saveAs()
          },
          icon: h('img', {
            src: '/public/images/icons/add_icon24.png',
            style: {
              width: '20px',
              height: '20px',
            }
          }),
          disabled: this.imgDataUrl == '' ? true : false
        },
      ]
    });
  }

  copyImage(img: string) {
    this.copiedImg = `${img}`
  }

  pasteImage(img: string) {
    this.imgDataUrl = img
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
  async loadProductComboList() {
    try {
      const { data } = await bookingApi.bookingReservationProductComboList(this.bookingNumber);
      this.comboList = data
    } catch (error) {
      getError(error)
    }
  }

  async loadProductList(categoryCode: any = this.form.category_code) {
    try {
      if (categoryCode) {
        let param = {
          category_code: categoryCode
        }
        const { data } = await bookingApi.bookingReservationProductList(param);
        this.productList = data
      } else {
        this.productList = []
      }
    } catch (error) {
      getError(error)
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        "commons.product"
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        "commons.product"
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        "commons.product"
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
