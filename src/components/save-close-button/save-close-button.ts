import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    isSaving: {
      type: Boolean,
      default: false,
    },
    saveDisabled: {
      type: Boolean,
      default: false,
    },
    saveText: {
      type: String,
      default: "save",
    },
    save: {
      type: Boolean,
    },
  },
  emits: ["close", "save"],
})
export default class SaveCloseButton extends Vue {
  saveDisabled: boolean;
  isSaving: boolean;

  public async mounted(): Promise<void> {
    // document.addEventListener("keydown", this.handleShortcut);
  }

  beforeUnmount() {
    // document.removeEventListener("keydown", this.handleShortcut);
  }

  handleShortcut(event: any) {
    if (event.key === "Escape" && !this.isSaving && !this.saveDisabled) {
      event.preventDefault();
      this.$emit("close", false);
    } else if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      this.onSave();
    }
  }
  onSave() {
    if (this.saveDisabled) return;
    this.$emit("save");
  }
}
