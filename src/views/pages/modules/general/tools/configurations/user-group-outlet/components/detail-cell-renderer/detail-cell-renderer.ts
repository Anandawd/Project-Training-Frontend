import ConfigurationResource from "@/services/api/configuration/configuration-resource";
import { ref } from "vue";
import { Options, Vue } from "vue-class-component";
import Outlet from "../outlet-table/outlet-table.vue";

const resourceAPI = new ConfigurationResource("UserGroupOutlet");

@Options({
  components: {
    Outlet
  },
  props: ['params']
})

export default class DetailCellRenderer extends Vue {
  public params: any;
  public outletRowData: any = [];
  public outletElement: any = ref();

  beforeMount() {
    this.loadDetailData(this.params.data.code);
  }

  async loadDetailData(code: string) {
    try {
      const { data } = await resourceAPI.detailDataList('Outlet', code);
      this.outletRowData = data.PackageBreakdown;
    } catch (error) {

    }
  }


}