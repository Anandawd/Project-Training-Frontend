import { Options, Vue } from "vue-class-component";
import {
  loginByAuth,

  // loginByGoogle,
  // loginByFacebook,
} from "@/services/auth";
import auth from "@/services/api/auth/auth";
import Checkbox from "@/components/checkbox/checkbox.vue";
import Input from "@/components/login-input/input.vue";
import CInput from "@/components/input/input.vue";
import Button from "@/components/button/button.vue";
import CSelect from "@/components/select/select.vue";
import { useToast } from "vue-toastification";
import authModule from "@/stores/auth";
import { version } from "../../../../package.json";
import { formatDateTime2 } from "@/utils/format";
import EncryptionHelper from "@/utils/crypto";
import { formatDate3 } from "@/utils/format";
import configStore from "@/stores/config";
import { setInputFocus } from "@/utils/validation";
const encryptionHelper = new EncryptionHelper();
const authAPI = new auth();

@Options({
  components: {
    "app-checkbox": Checkbox,
    "app-input": Input,
    "app-button": Button,
    CInput,
    CSelect,
  },
})
export default class Login extends Vue {
  private appElement: HTMLElement | null = null;
  public email: string = "";
  public password: string = "";
  public rememberMe: boolean = false;
  public isAuthLoading: boolean = false;
  public isFacebookLoading: boolean = false;
  public isGoogleLoading: boolean = false;
  public formatDate = formatDate3;
  public formatDateTime = formatDateTime2;
  public config = configStore();
  public auth = authModule();
  public shiftForm: any = {};
  public workingShift: any = [];
  public showShiftInformation: boolean = false;
  private toast = useToast();
  public shift: string = "";
  public disabledShift: boolean = false;
  private version: string = version;
  errorMessage: any = "";
  isFirstLogin: any = false;
  subscription: any;

  beforeMount() {
    this.getWorkingShift();
    this.getIsFirstLogin();
    this.auth.removeLocalData();
    this.subscription = this.auth.subscription;
  }

  public async mounted() {
    this.appElement = document.getElementById("app") as HTMLElement;
    this.appElement.classList.add("login-page");
    await this.$nextTick();
    setInputFocus();
  }

  public unmounted(): void {
    (this.appElement as HTMLElement).classList.remove("login-page");
  }

  public async loginByAuth(): Promise<void> {
    if (!this.ableToSign) return;
    try {
      this.isAuthLoading = true;
      const password = await encryptionHelper.encrypt(this.password);
      // await loginByAuth(this.email, password, this.shift);
      const { data } = await authAPI.login(this.email, password, this.shift);

      await this.getShiftInformation();
      await this.auth.login(this.email, data);
      await this.config.getConfigurations();
      if (!this.config.wizardComplete) {
        const params = {
          opening_balance: this.shiftForm.opening_balance,
        };
        await authAPI.setOpeningBalance(params);
        this.$router.push({ path: "/", replace: true });
      } else {
        this.showShiftInformation = true;
        this.isAuthLoading = false;
        this.$nextTick(() => {
          const el = document.getElementById("btnShiftOK");
          if (el) el.focus();
        });
      }
      this.toast.success("Login success");
    } catch (error: any) {
      console.log(error);
      // getError(error);
      this.errorMessage = this.$t("messages.loginFailed");
      if (error.response) {
        let status = error.response.status2;
        if (status) {
          if (status && status.status == 999) {
            this.errorMessage = this.$t("messages.loginAttempt");
          }
        }
      }
      // this.toast.error(error.message);
      this.isAuthLoading = false;
    }
  }

  onBlurUserID() {
    this.getShiftInformation();
  }

  onClickOK() {
    this.setOpeningBalance();
  }

  async getShiftInformation() {
    if (!this.email) return;
    try {
      this.disabledShift = false;
      const { data } = await authAPI.getShiftInformation(this.email);
      this.shiftForm = data ?? {};
      this.shift = this.shiftForm.shift;
      if (this.shift != "") {
        this.disabledShift = true;
      }
    } catch (error: any) {
      this.toast.error(error.message);
    }
  }

  async setOpeningBalance() {
    if (this.isAuthLoading) return;
    this.isAuthLoading = true;
    try {
      const params = {
        opening_balance: this.shiftForm.opening_balance,
      };
      await authAPI.setOpeningBalance(params);
      this.$router.push({ path: "/", replace: true });
    } catch (error: any) {
      this.toast.error(error.message);
      this.isAuthLoading = false;
    }
  }

  async getWorkingShift() {
    try {
      const { data } = await authAPI.getWorkingShift();
      this.workingShift = data;
    } catch (error: any) {
      this.toast.error(error.message);
    }
  }

  async getIsFirstLogin() {
    try {
      const { data } = await authAPI.isFirstLogin();
      this.isFirstLogin = data;
    } catch (error: any) {
      this.toast.error(error.message);
    }
  }

  get ableToSign() {
    return (
      this.email.length >= 4 && this.password.length >= 6 && this.shift != ""
    );
  }

  get isWizardCompleted() {
    return this.config.wizardComplete;
  }

  // public async loginByFacebook(): Promise<void> {
  //   try {
  //     this.isFacebookLoading = true;
  //     const token = await loginByFacebook();
  //     this.$store.dispatch("auth/login", token);
  //     this.toast.success("Login succeeded");
  //     this.isFacebookLoading = false;
  //   } catch (error: any) {
  //     this.toast.error(error.message);
  //     this.isFacebookLoading = false;
  //   }
  // }

  // public async loginByGoogle(): Promise<void> {
  //   try {
  //     this.isGoogleLoading = true;
  //     const token = await loginByGoogle();
  //     this.$store.dispatch("auth/login", token);
  //     this.toast.success("Login succeeded");
  //     this.isGoogleLoading = false;
  //   } catch (error: any) {
  //     this.toast.error(error.message);
  //     this.isGoogleLoading = false;
  //   }
  // }
}
