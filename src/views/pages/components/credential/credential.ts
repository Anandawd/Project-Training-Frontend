import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CDialog from "../../../../components/dialog/dialog.vue";
import AuthAPI from "../../../../services/api/auth/auth";
import { getError } from "@/utils/general";
import $global from "@/utils/global";
import EncryptionHelper from "@/utils/crypto";
import { getToastError } from "@/utils/toast";
const authAPI = new AuthAPI();
const encryptionHelper = new EncryptionHelper();
@Options({
  name: "c-credential",
  components: {
    CInput,
    CDialog,
  },
  props: {
    isEncrypt: {
      type: Boolean,
      default: false,
    },
    module: {
      type: String,
      require: true,
    },
  },
  emits: ["close", "save"],
  watch: {
    show(val: any) {
      // if (val) {
      //   document.addEventListener("keydown", this.handleShortcut);
      //   // this.tabIndex = 0
      // } else {
      //   document.removeEventListener("keydown", this.handleShortcut);
      // }
    },
  },
})
export default class Credential extends Vue {
  public accessDeniedCount: number = 0;
  public isEncrypt: boolean = false;
  public showReason: boolean = false;
  public reason: boolean = false;
  public showVerify: boolean = false;
  public title: string = "";
  public accessType: string = "";
  public accessMode: number = null;
  public btnTitle: string = "";
  public verifying: boolean = false;
  public onVerified: Function;
  public onCancel: Function;
  public form: any = {
    userId: "",
    password: "",
    reason: "",
  };
  private module: string;
  public show: any = false;
  isSaving: any = false;

  mounted() {
    this.initialize();
  }

  onClose() {
    this.initialize();
    this.show = false;
    this.$emit("close", false);
  }

  onSave() {
    this.show = false;
    this.$emit("save", this.form);
    this.initialize();
  }

  async onVerify() {
    if (!this.form.userId || !this.form.password) return;
    this.verifying = true;
    if (this.showVerify) {
      let canAccess = await this.verifyAccess();
      if (canAccess) {
        if (this.reason) {
          this.btnTitle = this.$t("buttons.ok");
          this.showVerify = false;
        } else {
          this.onVerified();
        }
      }
    } else if (this.reason) {
      if (this.form.reason) this.onVerified();
    }
    this.verifying = false;
  }

  showCredential(options: {
    show: boolean;
    title: string;
    accessType?: string;
    accessMode: number;
    showReason: boolean;
    additionalData?: any;
    onVerified: Function;
    onCancel?: Function;
  }) {
    // if (!Object.values($global.userAccessType).includes(options.accessType)) {
    //   throw new Error(
    //     "Invalid access type. Please use one of the allowed types from userAccessType object."
    //   );
    // }

    // if (
    //   !Object.values($global.accessSpecialOrder).includes(options.accessMode)
    // ) {
    //   throw new Error(
    //     "Invalid access mode. Please use one of the allowed types from accessSpecialOrder object."
    //   );
    // }
    this.initialize();
    this.accessType = options.accessType;
    this.accessMode = options.accessMode;
    this.reason = options.showReason;
    this.form.access_type = options.accessType;
    this.form.additional = options.additionalData;
    this.form.access_mode = options.accessMode;
    this.show = options.show;
    this.title = options.title ?? this.$t("messages.credential");
    this.onVerified = async function () {
      this.isSaving = true;
      (await options.onVerified(this.form)) ?? null;
      this.show = false;
      this.isSaving = false;
    };
    this.onCancel = () => {
      if (options.onCancel) {
        options.onCancel();
      }
      this.show = false;
    };
  }

  initialize() {
    this.accessDeniedCount = 0;
    this.showVerify = true;
    this.btnTitle = this.$t("buttons.verify");
    this.accessType = "";
    this.accessMode = null;
    this.title = "";
    this.form = {
      userId: "",
      password: "",
      reason: "",
    };
  }

  // API
  async verifyAccess() {
    try {
      const password = await encryptionHelper.encrypt(this.form.password);
      const params = {
        user_id: this.form.userId,
        password: password,
        user_access_type_code: $global.userAccessType.special,
        access_mode: Array.isArray(this.accessMode)
          ? this.accessMode
          : [this.accessMode],
        system_code: this.module,
      };
      const { data } = await authAPI.verifyAccess(params);
      if (!data) {
        this.accessDeniedCount++;
        getToastError(this.$t("messages.accessDenied"));
        if (this.accessDeniedCount > 2) this.show = false;
      }
      return data;
    } catch (err) {
      getError(err);
    }
  }
}
