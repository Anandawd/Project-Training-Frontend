import { generateIconMenuAgGrid } from "@/utils/general";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "c_modal",
  props: {
    title: String,
    close: Boolean,
    save: Boolean,
    stockCard: Boolean,
    confirm: Boolean,
    noPadding: Boolean,
    isSaving: Boolean,
    saveText: {
      type: String,
      default: "save",
    },
    size: {
      type: Number,
      default: "lg",
    },
    hideBackground: Boolean,
  },
  emits: ["close", "save", "print"],
})
export default class CModal extends Vue {
  public active: boolean = false;
  public paramsDataStatusCode = "N";
  public paramsDataIsLock = false;
  iconPrintReport: any = generateIconMenuAgGrid("color_print_icon32");

}
