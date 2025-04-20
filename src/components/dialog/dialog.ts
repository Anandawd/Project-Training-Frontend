import { Options, Vue } from "vue-class-component";

@Options({
  name: "c-dialog",
  props: {
    w100: Boolean,
    dialogTitle: String,
    title: String,
    close: Boolean,
    isSaving: Boolean,
    isLoading: Boolean,
    confirm: Boolean,
    size: {
      type: Number,
      default: "sm",
    },
    confirmText: {
      type: String,
      default: "Yes",
    },
    confirmClass: {
      type: String,
      default: "btn-primary",
    },
    cancelText: {
      type: String,
      default: "No",
    },
    cancelClass: {
      type: String,
      default: "btn-outline-secondary",
    },
  },
  emits: ["cancel", "confirm"],
})
export default class CDialog extends Vue {
  public active: boolean = false;
  public close: boolean = false;
  public isSaving: boolean = false;
  public isLoading: boolean = false;

  public async mounted(): Promise<void> {
    console.log("dialog mounted");
    document.addEventListener("keydown", this.handleShortcut);
  }

  beforeUnmount() {
    console.log("dialog unmounted");
    document.removeEventListener("keydown", this.handleShortcut);
  }

  handleShortcut(event: any) {
    if (event.key === "Escape") {
      this.handleClose();
    } else if (event.key === "Enter") {
      // this.handleConfirm();
    }
  }

  handleConfirm() {
    if (!this.isSaving && !this.isLoading) {
      this.$emit("confirm");
    }
  }

  handleClose() {
    if (!this.isSaving && !this.isLoading) {
      if (this.close) {
        this.$emit("close");
      } else {
        this.$emit("cancel");
      }
    }
  }
}
