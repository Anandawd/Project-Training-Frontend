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
import MyUpload from 'vue-image-crop-upload';
import { ref, h } from "vue";
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

@Options({
  name: "InputForm",
  components: {
    Form,
    CRadio,
    CSelect,
    CDatepicker,
    CInput,
    Checkbox,
    CCheckbox,
    MyUpload,
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
    codeDisabled: {
      type:Boolean,
    },
    maxLengthCode: {
      type: Number,
    },
    maxLengthName: {
      type: Number,
    },
    maxLengthSymbol: {
      type: Number,
    },
    maxLengthNumber: {
      type: Number,
    },
    columnOptions: {
      type: Array,
    },
    maxLengthPrefix: {
      type: Number,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
    uploadURL: {
      type: String,
      require: false,
      default: ""
    },
  },
  emits: ["save", "close", "changeGroup", "changeAccount", "changeCountry"],
})
export default class InputForm extends Vue {
  isSaving: boolean;
  isDisable: boolean = true;
  inputFormElement: any = ref();
  modeData: any;
  // for image uploader
  testImageURL: string = "/images/company/1682748703_CMD.jpg"
  uploadURL: string = ""
  public headers: any = {};
  public params = {
    token: "123456789",
    name: "outlet",
  };
  public showImageUploader: boolean = false;
  copiedImg: string = ""
  imgDataUrl: any = null

  public defaultForm: any = {};
  public form: any = {};
  public formats: Array<any> = [
    { code: 1, name: ",0.;-,0." },
    { code: 2, name: ",0.0;-,0.0" },
    { code: 3, name: ",0.00;-,0.00" },
    { code: 4, name: ",0.000;-,0.000" },
  ];
  public colorFormElement: any = ref()
  href: string
  show: boolean = false
  listDropdown: any = {
    accountCharge: [],
    global: [],
    type: [],
    bankAccount: [],
    department: [],
    accountSubGroup: [],
    continent: [],
    country: [],
    state: [],
    regency: [],
    group: [],
    journalAccountSubGroup: [],
    city: [],
    market: [],
    accountEdc: [],
    outlet: [],
    category: [],
    account: [],
    room: [],
    company: [],
    product: [],
    venueByLocation: [],
  };
  isWidgetValue: boolean = false
  handler: any
  public pureColor: any
  public gradientColor: any = ref("linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)");
  public formType: any
  // GENERAL FUNCTION ================================================================
  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async active(event: any) {
    window.scrollTo(0, 1)
  }

  async resetForm() {
    this.inputFormElement.resetForm();
    await this.$nextTick();
    if (this.defaultForm != 0) {
      this.form = this.defaultForm;
      this.imgDataUrl = ""
    }
    setInputFocus()
  }

  initialize() {
    this.resetForm();
  }

  onSubmit() {
    this.inputFormElement.$el.requestSubmit();
  }

  onSave() {
    if (this.formType == $global.formType.seatingPlan) {
      this.form.image = btoa(this.imgDataUrl)
    }

    this.$emit("save", this.form);
    // if (
    //   !this.form.code ||
    //   !this.form.name &&
    //   !this.form.description
    // )
    //   return;
  }

  onClose() {
    this.$emit("close");
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangeItemGroup() {
    this.$emit("changeGroup");
  }

  changeAccount(event: any) {
    this.$emit("changeAccount", event);
  }

  onChangeParent() {
    this.$emit("changeParent");
  }

  onChangeCountry(event: any) {
    this.$emit("changeCountry", event);
  }

  onChangeVenueLocation(event: any) {
    this.$emit("changeLocation", event)
  }

  onChangeCalculation(data: any){
    this.$emit("changeCalculation", data)
  }

  onClickResetImage() {
    this.imgDataUrl = ""
  }

  toggleShow() {
    this.show = !this.show;
  }

  cropSuccess(imgDataUrl: any, field: any) {
    console.log("-------- crop success --------");
    this.imgDataUrl = imgDataUrl
    // this.href = imgDataUrl
  }

  cropUploadSuccess(jsonData: any, field: any) {
    this.$emit("successUploadImage", this.form.code)
  }

  cropUploadFail(status: any, field: any) {
    console.log("-------- upload fail --------");
    console.log(status);
    console.log("field: " + field);
  }

  handleShowImageUploader() {
    this.showImageUploader = !this.showImageUploader;
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

  repeatLoadDropdownList() {
    this.$emit("repeatLoadDropdown")
  }
  // @repeatLoadDropdown="loadDropdown"
  //   this.gridApi.showLoadingOverlay()
  //   getError(error)
  //   this.gridApi.hideOverlay()
  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  mounted(): void {
    console.log(import.meta.env.VITE_APP_SECRET_USER);
    console.log(import.meta.env.VITE_APP_SECRET_PASSWORD);
    this.headers = {
      Authorization:
        "Basic " +
        btoa(
          import.meta.env.VITE_APP_SECRET_USER +
            ":" +
            import.meta.env.VITE_APP_SECRET_PASSWORD
        ),
  }
}
  // END RECYCLE LIFE FUNCTION =======================================================
  // GETTER AND SETTER ===============================================================
  get screenSize() {
    return this.$store.getters["ui/screenSize"];
  }

  get title() {
    if (this.modeData === $global.modeData.insert) {
      return `${this.$t("commons.insert")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.edit) {
      return `${this.$t("commons.update")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    } else if (this.modeData === $global.modeData.duplicate) {
      return `${this.$t("commons.duplicate")} ${this.$t(
        `${this.$route.meta.pageTitle}`
      )}`;
    }
  }
  // END GETTER AND SETTER ===========================================================
}
