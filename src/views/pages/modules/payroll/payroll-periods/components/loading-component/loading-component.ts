import CDatepicker from "@/components/datepicker/datepicker.vue";
import CInput from "@/components/input/input.vue";
import CRadio from "@/components/radio/radio.vue";
import CSelect from "@/components/select/select.vue";
import { Form as CForm } from "vee-validate";
import { Options, Vue } from "vue-class-component";

@Options({
  name: "LoadingComponent",
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
      default: (): string => "Loading Data",
    },
    subtitle: {
      type: String,
      required: true,
      default: (): string => "Please wait...",
    },
  },
})
export default class LoadingComponent extends Vue {
  subtitle!: string;
  footertitle!: string;
}
