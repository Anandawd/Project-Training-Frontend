import { Options, Vue } from "vue-class-component";
import { ref, reactive } from "vue";
import CInput from "@/components/input/input.vue";
import * as Yup from "yup";
import BookingApi from "@/services/api/banquet/booking";
import { anyToFloat, getError } from "@/utils/general";
const bookingApi = new BookingApi();

@Options({
  components: {
    CInput
  },
  props: {
    formType: {
      type: String,
      require: true,
    },
    modeData: {
      type: Number,
      require: true
    },
    focus: {
      type: Boolean,
      default: false
    }
  },
  emits: ["isGroupCheckIn", "checkIn", "refreshData"],
})
export default class RemarkForm extends Vue {
  form: any = { booking_data: {} }
  memo: any = []
  header: any = []
  remarkInformationValidation: any = ref()
  modeData: number
  headerResRemark: any = [];
  remark: any = []
  focus: boolean

  async initialize(formData?: any) {
    await this.resetForm(formData)
  }

  async resetForm(formData: any) {
    this.remarkInformationValidation.resetForm();
    await this.$nextTick()
    this.form.booking_data = {}
    this.memo = []

    if (this.modeData == this.$global.modeData.edit || this.modeData == this.$global.modeData.duplicate || this.modeData == this.$global.modeData.checkIn) {
      await this.setDataForm(formData)
    }
  }

  onSave() {
    let tempRemark = reactive({})
    for (const i in this.headerResRemark) {
      tempRemark = {
        number: anyToFloat(this.headerResRemark[i].code),
        header: this.headerResRemark[i].name,
        memo: this.memo[i] ? this.memo[i] : ""
      }
      this.remark.push(tempRemark)
    }

    let remarkData = [this.form.booking_data.beo_note, this.remark]
    this.$emit("save", remarkData)
    this.remark = []
  }

  setDataForm(formData: any) {
    this.form.booking_data.beo_note = formData.BookingData.beo_note
    for (const i in formData.remark) {
      this.memo[i] = formData.remark[i].memo
    }
  }

  async loadDropdown() {
    try {
      let params = ["HeaderReservationRemark"];
      const { data } = await bookingApi.codeNameListArray(params);
      this.headerResRemark = data.HeaderReservationRemark
    } catch (error) {
      getError(error);
    }
  }

  mounted() {
    this.loadDropdown()
  }

  get schema() {
    return Yup.object().shape({
      "beoNotes": Yup.string().required()
    })
  }
}
