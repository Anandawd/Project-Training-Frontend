import { Options, Vue } from "vue-class-component";

@Options({
  name: "loading_indicator",
  props: {
    title: String,
    close: Boolean,
    save: Boolean,
    confirm: Boolean,
    isSaving: Boolean,
    size: {
      type: Number,
      default: "lg",
    },
    hideBackground: Boolean,
  },
  emits: ["close", "save"],
})
export default class Loading extends Vue {
  public text: string = "Loading";
  public dark: boolean = false;
  public classes: any = null;
  public loading: boolean = false;
  public background: any = null;
  public customLoader: any = null;

  get bc() {
    return (
      this.background ||
      (this.dark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)")
    );
  }
}
