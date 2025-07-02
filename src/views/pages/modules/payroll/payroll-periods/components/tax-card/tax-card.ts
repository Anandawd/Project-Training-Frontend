import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { formatCurrency } from "@/utils/format";
import { Form as CForm } from "vee-validate";
import { reactive } from "vue";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "TaxCard",
  components: {
    CForm,
    CInput,
    CSelect,
    CDatepicker,
    CRadio,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
      default: (): any => {},
    },
  },
})
export default class TaxCard extends Vue {
  title!: string;
  data: any = reactive({});

  formatCurrency(value: any) {
    return formatCurrency(value);
  }
}
