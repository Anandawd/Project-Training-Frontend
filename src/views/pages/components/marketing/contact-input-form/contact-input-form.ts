import { Options, Vue } from "vue-class-component";
import CSelect from "@/components/select/select.vue";
import CInput from "@/components/input/input.vue";
import { Form } from "vee-validate";
import { focusOnInvalid } from "@/utils/validation";
import * as Yup from "yup";
import { reactive, ref } from "vue";
import { getError } from "@/utils/general";
import SalesActivityAPI from "@/services/api/sales-activity/sales-activity";
import SalActivityContactAPI from "@/services/api/sales-activity/sal-activity-contact";
const salesActivityApi = new SalesActivityAPI()
const salActivityContactAPI = new SalActivityContactAPI()

@Options({
  name: "InputForm",
  components: {
    Form,
    CSelect,
    CInput,
  },
  props: {
    modeData: {
      type: Number,
      require: true,
    },
    isSaving: {
      type: Boolean,
    },
    formType: {
      type: String,
      default: "",
      require: true
    },
    contactId: {
      type: Number
    }
  },
  emits: ["save", "close"],
})
export default class ContactForm extends Vue {
  contactInputFormValidation: any = ref()
  modeData: any
  public defaultForm: any = {}
  public form: any = reactive({})
  dropDownlist: any = []
  formType: string
  contactId: number
  async resetForm() {
    this.contactInputFormValidation.resetForm();
    this.loadDropdownList()
    await this.$nextTick();
    this.form = {}
  }

  initialize(formData: any) {
    this.resetForm();
  }

  onDuplicate(data: any) {
    this.form = data;
  }

  async onSave() {
    console.log(this.form, 'contact punya');
    
    this.$emit("save", this.form);
  }

  onSubmit() {
    this.contactInputFormValidation.$el.requestSubmit();
  }

  onInvalidSubmit() {
    focusOnInvalid();
  }

  onChangeCountry(event: any) {
    this.dropDownlist.State = event.target.value != "" ? this.loadStateDropdownList(event.target.value) : []
  }
  // END GENERAL FUNCTION ============================================================
  // API REQUEST======================================================================
  async loadDropdownList() {
    try {
      let params = ["Country", "Company", "PhoneBookType", "GuestTitle"]
      const { data } = await salesActivityApi.GetDropdownArrayList(params)
      this.dropDownlist = data
    } catch (error) {
      getError(error)
    }
  }

  async loadStateDropdownList(countryCode: any) {
    try {
      let { data } = await salActivityContactAPI.GetStateByCountry(countryCode)
      this.dropDownlist.State = data
    } catch (error) {
      getError(error)
    }
  }
  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  mounted() {
    this.loadDropdownList()
  }
  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================
  //Validation
  get schema() {
    return Yup.object().shape({
      type: Yup.string().required(),
      fullName: Yup.string().required(),
      mobilePhone: Yup.string().required(),
      // email: Yup.string().required().test((val) => { return this.contactId > 0 })
    });
  }
  // END GETTER AND SETTER ===========================================================
}
