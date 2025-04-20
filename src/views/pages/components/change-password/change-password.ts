import { Options, Vue } from "vue-class-component";
import ReservationAPI from "@/services/api/hotel/reservation/reservation";
import configStore from "@/stores/config";
import { formatDate3 } from "@/utils/format";
import CInput from "@/components/input/input.vue";
import CModal from "@/components/modal/modal.vue";
import * as Yup from "yup";
import AuthAPI from "@/services/api/auth/auth";
import { focusOnInvalid } from "@/utils/validation";
import { getError } from "@/utils/general";
import { getToastSuccess } from "@/utils/toast";
import EncryptionHelper from "@/utils/crypto";
const authAPI = new AuthAPI();
const encryptionHelper = new EncryptionHelper();

@Options({
  components: {
    CModal,
    CInput,
  },
})
export default class ChangePassword extends Vue {
  public config: any = configStore();
  public form: any = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };
  public errors: any = {};
  validate: any = null;
  isSaving: boolean = false;

  // GENERAL FUNCTION ================================================================

  // END GENERAL FUNCTION ============================================================
  // HANDLE UI =======================================================================
  async onSubmit() {
    this.changeUserPassword();
  }

  onInvalidSubmit() {
    this.errors = this.validate.getErrors();
    focusOnInvalid();
  }

  handleSave() {
    this.validate.$el.requestSubmit();
  }

  // END HANDLE UI====================================================================
  // API REQUEST======================================================================
  async changeUserPassword() {
    this.isSaving = true;
    const oldP = await encryptionHelper.encrypt(this.form.old_password);
    const newP = await encryptionHelper.encrypt(this.form.new_password);
    const confP = await encryptionHelper.encrypt(this.form.confirm_password);
    const params = {
      old_password: oldP,
      new_password: newP,
      confirm_password: confP,
    };
    try {
      const { data } = await authAPI.changeUserPassword(params);
      this.$emit("close");
      getToastSuccess();
    } catch (error) {
      getError(error);
    }
    this.isSaving = false;
  }

  // END API REQUEST==================================================================
  // RECYCLE LIFE FUNCTION ===========================================================
  mounted() {}

  get auditDate() {
    return formatDate3(this.config.auditDate);
  }

  // END RECYCLE LIFE FUNCTION =======================================================

  // GETTER AND SETTER ===============================================================
  get schema() {
    return Yup.object().shape({
      "Old Password": Yup.string().required(),
      "New Password":
        this.form.new_password != this.form.old_password
          ? Yup.string()
              .required("New Password is required")
              .matches(
                /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?/])[a-zA-Z0-9\s!@#$%^&*()_+\-=[\]{}|\\:;"'<>,.?/]*$/,
                "Need at least one special character, alphabet and number"
              )
          : null,
      "Confirm Password":
        this.form.new_password != this.form.old_password
          ? Yup.string()
              .oneOf([Yup.ref("New Password"), null], "Passwords didn't match")
              .required("Confirm Password is required")
          : null,
    });
  }
  // VALIDATION ======================================================================

  // END GETTER AND SETTER ===========================================================
}
