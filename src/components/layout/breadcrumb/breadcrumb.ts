import { generateIconMenuAgGrid } from "@/utils/general";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "breadcrumb",
  watch: {
    $route() {
      this.routeTitle = this.$route.meta.pageTitle;
      this.breadcrumb = this.$route.meta.breadcrumb;
      this.icon = this.generateIcon(this.$route.meta.icon);
    },
  },
})
export default class Breadcrumb extends Vue {
  public routeTitle: any = "";
  public breadcrumb: any = [];
  public icon: any = "";

  public beforeMount(): void {
    this.routeTitle = this.$route.meta.pageTitle;
    this.breadcrumb = this.$route.meta.breadcrumb;
    this.icon = this.generateIcon(this.$route.meta.icon);
  }

  generateIcon(icon: any) {
    if (!icon) return "";
    let isColor = true;
    const size = "64";
    let iconPrefix = "";
    if (isColor) {
      iconPrefix = "color_";
    }
    console.log(icon);
    return generateIconMenuAgGrid(`${iconPrefix}${icon}_icon${size}`);
  }

  get routeChange() {
    this.routeTitle = this.$route.meta.pageTitle;
    return this.$route;
  }
}
