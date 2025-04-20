import { getToastInfo } from "@/utils/toast";
import { Options, Vue } from "vue-class-component";
import CModal from "@/components/modal/modal.vue";
import store from "../../modules/general/tools/configurations/store/store.vue";
import item from "../../modules/general/tools/configurations/item/item.vue";
import faItem from "../../modules/general/tools/configurations/fa-item/fa-item.vue";

@Options({
  components: {
    CModal,
    store,
  },
  props: {
    configName: {
      type: String,
      required: true,
    },
  },
})
export default class ConfigurationOption extends Vue {
  selectedData: any;
  activeConfig: any = null;
  configName: any;

  onSelectedData(params: any) {
    this.selectedData = params;
  }

  handleSelectData() {
    this.$emit("selected", this.selectedData);
    if (!this.selectedData) return getToastInfo("Please select data first.");
  }

  handleClose() {
    this.$emit("close");
  }

  mounted() {
    let activeConfig;
    switch (this.configName) {
      case "store":
        activeConfig = store;
        break;
      case "item":
        activeConfig = item;
        break;
      case "faItem":
        activeConfig = faItem;
        break;
      default:
        activeConfig = null;
    }
    this.activeConfig = activeConfig;
  }
}
