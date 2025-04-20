import { Options, Vue } from "vue-class-component";
import CDialog from "@/components/dialog/dialog.vue";

@Options({
  components: {
    CDialog,
  },
  props: {
    size: {
      type: Number,
      default: "sm",
    },
    isLoading: Boolean,
    isSaving: Boolean,
  },
})
export default class CConfirmation extends Vue {
  public setTitle: string = "";
  public setText: string = "";
  public title: string = "";
  public text: string = "";
  public confirmText: string = "";
  public cancelText: string = "";
  public show: boolean = false;
  public onConfirmX: Function = null;
  public onCancelX: Function = null;

  mounted() {
    this.setTitle = !this.title
      ? this.$t("messages.confirmationTitle")
      : this.title;
    this.setText = !this.text
      ? this.$t("messages.confirmationText")
      : this.text;
  }

  showConfirmation(options: {
    show: boolean;
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: Function;
    onCancel?: Function;
    params: any;
  }) {
    this.show = options.show;
    this.confirmText = options.confirmText ?? this.$t("messages.yes");
    this.cancelText = options.cancelText ?? this.$t("messages.no");
    this.setText = options.text ?? this.$t("messages.confirmationText");
    this.setTitle = options.title ?? this.$t("messages.confirmationTitle");
    this.onConfirmX = function () {
      let params: any = [];
      if (typeof options.params == "object") {
        params = options.params;
      }
      options.onConfirm(...params) ?? null;
      this.show = false;
    };
    this.onCancelX = () => {
      if (options.onCancel) {
        options.onCancel();
      }
      this.show = false;
    };
  }
}
