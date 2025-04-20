import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CDialog from "@/components/dialog/dialog.vue";
import { ref } from "vue";
import { getToastError } from "@/utils/toast";

@Options({
  components: {
    CInput,
    CDialog,
  },
  props: {
    title: {
      type: String,
      require: true,
    },
    isLoading: Boolean,
  },
  emits: ["close", "save"],
})
export default class Reason extends Vue {
  public reason: string = "";
  public show: any = false;
  public title: any = ref();

  mounted() {
    this.initialize();
    const el = document.getElementById("inputReason");
    el.focus();
  }

  onClose() {
    this.reason = "";
    this.$emit("close", false);
  }

  onSave() {
    if (!this.reason) {
      return getToastError("Please input reason");
    }
    this.$emit("save", this.reason);
  }

  initialize() {
    this.reason = "";
  }
}
