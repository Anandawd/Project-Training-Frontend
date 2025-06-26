import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { Form as CForm } from "vee-validate";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "InputForm",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
  },
  props: {
    employee: {
      type: Object,
      required: true,
      default: (): any => ({}),
    },
  },
  emits: ["save"],
})
export default class InputForm extends Vue {
  employee: any = reactive({
    // personal information
    profile_photo: "",
    employee_id: "",
    first_name: "",
    last_name: "",
    gender: "Male",
    birth_date: "",
    phone: "",
    email: "",
    address: "",

    // employment information
    hire_date: "",
    end_date: "",
    status: "1",
    employee_type: "Permanent",
    position_code: "",
    department_code: "",
    placement_code: "",
    supervisor_id: "",

    // salary & payment information
    payment_frequency: "Monthly",
    payment_method: "Bank Transfer",
    bank_name: "BRI",
    bank_account_number: "",
    bank_account_name: "",

    // tax and identification data
    tax_number: "",
    identity_number: "",
    maritial_status: "TK0",
    health_insurance_number: "",
    social_security_number: "",

    // leave information
    annual_leave_quota: 0,
    annual_leave_remaining: 0,

    created_at: "",
    created_by: "",
    updated_at: "",
    updated_by: "",
  });
}
