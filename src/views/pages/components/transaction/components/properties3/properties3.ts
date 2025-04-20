import { Options, Vue } from "vue-class-component";
import CInput from "@/components/input/input.vue";
import CDatepicker from "@/components/datepicker/datepicker.vue";
import { formatDateDatabase } from "@/utils/format";
import { Skeleton } from "vue-loading-skeleton";
import { getError } from "@/utils/general";
import TransactionAPI from "@/services/api/transaction";
const transactionAPI = new TransactionAPI();

@Options({
  components: {
    CInput,
    CDatepicker,
    Skeleton,
  },
  props: {
    id: {
      type: Number,
      require: true,
    },
  },
})
export default class Properties3 extends Vue {
  public form: any = {};
  id: number;

  mounted() {
    this.getPropertiesData();
  }

  //API CALL================================================================================================
  async getPropertiesData() {
    try {
      const { data } = await transactionAPI.getProperties3(this.id);
      this.form = data;
      this.form.audit_date = formatDateDatabase(this.form.audit_date);
    } catch (error) {
      getError(error);
    }
  }
  //END API CALL================================================================================================
}
